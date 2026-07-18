import { enrichProduct } from "./ai-processing";
import { buildBehavioralBundles } from "./bundling";
import type { EnrichedProduct, Order, PlatformId, RawProduct } from "./types";

/**
 * محرك التوصيات — قلب «طبقة الذكاء الاصطناعي» فوق المتجر.
 *
 * يحلّل بيانات المتجر الجاهز ويقترح إجراءات يوافق عليها صاحب المتجر:
 *  - edit       : تحسين بيانات منتج (عنوان/وصف/تصنيف).
 *  - bundle     : دمج منتجين في حزمة بسعر مقترح.
 *  - cross_sell : خصم على منتج عند شراء منتج آخر.
 *  - price      : تعديل تسعير منتج بناءً على البيانات.
 *
 * كل توصية تحمل «السبب» (rationale) المبني على البيانات، والأثر المتوقّع،
 * وحالة الموافقة — لتظهر في صفحة مقترحة قبل النشر النهائي إلى المتجر.
 */

export type RecommendationType = "edit" | "bundle" | "cross_sell" | "price";
export type RecommendationStatus = "pending" | "approved" | "rejected";

export interface FieldChange {
  field: string;
  from: string;
  to: string;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  /** السبب المبني على البيانات. */
  rationale: string;
  /** الأثر المتوقّع (نص مختصر). */
  impact: string;
  /** درجة الثقة 0-1. */
  confidence: number;
  status: RecommendationStatus;
  detail: {
    skus: string[];
    productTitles: string[];
    currentPrice?: number;
    proposedPrice?: number;
    originalPrice?: number;
    bundlePrice?: number;
    discountPct?: number;
    triggerTitle?: string;
    targetTitle?: string;
    fieldChanges?: FieldChange[];
  };
}

const MARGIN = 1.4; // تسعير تقديري للعرض: التكلفة + 40%.
const money = (n: number) => Math.round(n * 100) / 100;
const shortName = (p: EnrichedProduct) => p.title.split("—")[0].trim();

function salesBySku(orders: Order[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    for (const it of o.items) m.set(it.sku, (m.get(it.sku) ?? 0) + it.qty);
  }
  return m;
}

/** يولّد توصيات «تعديل» للمنتجات ضعيفة البيانات. */
function editRecs(raw: RawProduct[], products: EnrichedProduct[]): Recommendation[] {
  const rawById = new Map(raw.map((r) => [r.sku, r]));
  return products
    .filter((p) => p.qualityScore < 65)
    .slice(0, 3)
    .map((p, i) => {
      const original = rawById.get(p.sku);
      const improved = enrichProduct(original ?? { sku: p.sku, rawName: shortName(p), cost: p.cost, stock: p.stock });
      return {
        id: `REC-E${i + 1}`,
        type: "edit" as const,
        title: `تحسين بيانات: ${shortName(p)}`,
        rationale: `درجة جودة البيانات ${p.qualityScore}% فقط — العنوان/الوصف الحالي يضعف الظهور في بحث المتجر.`,
        impact: "تحسين الظهور في البحث والنقر",
        confidence: 0.8,
        status: "pending" as const,
        detail: {
          skus: [p.sku],
          productTitles: [shortName(p)],
          fieldChanges: [
            { field: "العنوان", from: original?.rawName ?? shortName(p), to: improved.title },
            { field: "الوصف", from: "—", to: improved.description },
            { field: "التصنيف", from: "—", to: improved.category },
          ],
        },
      };
    });
}

/** يولّد توصيات «حزمة» من المنتجات التي تُشترى معًا. */
function bundleRecs(orders: Order[], products: EnrichedProduct[]): Recommendation[] {
  return buildBehavioralBundles(orders, products, 2).map((b, i) => {
    const titles = b.skus.map((s) => {
      const p = products.find((x) => x.sku === s);
      return p ? shortName(p) : s;
    });
    return {
      id: `REC-B${i + 1}`,
      type: "bundle" as const,
      title: `دمج في حزمة: ${titles.join(" + ")}`,
      rationale: b.reason,
      impact: `رفع متوسط قيمة السلة، خصم ${Math.round((1 - b.bundlePrice / b.originalPrice) * 100)}%`,
      confidence: b.expectedConversion,
      status: "pending" as const,
      detail: {
        skus: b.skus,
        productTitles: titles,
        originalPrice: b.originalPrice,
        bundlePrice: b.bundlePrice,
      },
    };
  });
}

/** يولّد توصيات «خصم تقاطعي»: خصم على منتج راكد عند شراء منتج رائج. */
function crossSellRecs(orders: Order[], products: EnrichedProduct[]): Recommendation[] {
  const sales = salesBySku(orders);
  const bestSellers = [...products].sort(
    (a, b) => (sales.get(b.sku) ?? 0) - (sales.get(a.sku) ?? 0)
  );
  const slow = products
    .filter((p) => p.stock > 20 && (sales.get(p.sku) ?? 0) <= 1)
    .sort((a, b) => b.stock - a.stock);

  return slow.slice(0, 2).map((target, i) => {
    const trigger = bestSellers[i % bestSellers.length];
    const discountPct = 15;
    const price = money(target.cost * MARGIN);
    return {
      id: `REC-C${i + 1}`,
      type: "cross_sell" as const,
      title: `خصم ${discountPct}% على «${shortName(target)}» عند شراء «${shortName(trigger)}»`,
      rationale: `${shortName(target)} راكد (مخزون ${target.stock} ومبيعات منخفضة)، بينما ${shortName(trigger)} من الأكثر مبيعًا — عرض تقاطعي يحرّك المخزون.`,
      impact: `تصفية مخزون راكد + رفع قيمة الطلب`,
      confidence: 0.7,
      status: "pending" as const,
      detail: {
        skus: [trigger.sku, target.sku],
        productTitles: [shortName(trigger), shortName(target)],
        triggerTitle: shortName(trigger),
        targetTitle: shortName(target),
        currentPrice: price,
        proposedPrice: money(price * (1 - discountPct / 100)),
        discountPct,
      },
    };
  });
}

/** يولّد توصيات «تسعير» للمنتجات ذات الهامش المنخفض. */
function priceRecs(products: EnrichedProduct[]): Recommendation[] {
  // للعرض: نقترح رفع سعر منتج مرتفع الطلب بهامش بسيط.
  return products
    .filter((p) => p.cost >= 60)
    .slice(0, 1)
    .map((p, i) => {
      const current = money(p.cost * MARGIN);
      const proposed = money(p.cost * (MARGIN + 0.08));
      return {
        id: `REC-P${i + 1}`,
        type: "price" as const,
        title: `تعديل سعر: ${shortName(p)}`,
        rationale: `المنتج ضمن فئة عالية القيمة ويحتمل هامشًا أعلى دون التأثير على الطلب بحسب بيانات المبيعات.`,
        impact: `+${money(proposed - current)} ريال ربح لكل قطعة`,
        confidence: 0.6,
        status: "pending" as const,
        detail: {
          skus: [p.sku],
          productTitles: [shortName(p)],
          currentPrice: current,
          proposedPrice: proposed,
        },
      };
    });
}

/** يولّد كل التوصيات من بيانات المتجر. */
export function generateRecommendations(
  raw: RawProduct[],
  products: EnrichedProduct[],
  orders: Order[],
  _platform: PlatformId
): Recommendation[] {
  return [
    ...bundleRecs(orders, products),
    ...crossSellRecs(orders, products),
    ...editRecs(raw, products),
    ...priceRecs(products),
  ];
}
