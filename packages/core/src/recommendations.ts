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

export type RecommendationType =
  | "edit"
  | "bundle"
  | "cross_sell"
  | "price"
  | "seasonal"
  | "restock"
  | "category";
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
  /** تاريخ التوليد (للسجل). */
  createdAt?: string;
  /** النتيجة المتحقّقة بعد التطبيق (تظهر في سجل التوصيات السابقة). */
  realized?: string;
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
    /** المناسبة الموسمية (لنوع seasonal). */
    occasion?: string;
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

interface Occasion {
  name: string;
  hint: string[];
  discount: number;
}

/** يحدّد المناسبة الموسمية بحسب الشهر (0 = يناير). */
function occasionForMonth(month: number): Occasion {
  if (month === 2 || month === 3) return { name: "رمضان والعيد", hint: ["تمر", "قهوة", "عطر", "عود"], discount: 20 };
  if (month >= 5 && month <= 8) return { name: "الصيف", hint: ["كريم", "عناية", "سماعة", "شاحن"], discount: 15 };
  if (month === 8 || month === 9) return { name: "العودة للمدارس", hint: ["مصباح", "حذاء", "قميص"], discount: 12 };
  if (month === 10) return { name: "الجمعة البيضاء", hint: [], discount: 25 };
  return { name: "الشتاء", hint: ["قميص", "حذاء", "عطر"], discount: 12 };
}

/** يولّد توصية موسمية بحسب المناسبة الحالية. */
function seasonalRecs(products: EnrichedProduct[], month: number): Recommendation[] {
  const occ = occasionForMonth(month);
  const matches = products.filter((p) =>
    occ.hint.some((h) => p.title.includes(h) || p.category.includes(h))
  );
  const picks = (matches.length >= 2 ? matches : products).slice(0, 3);
  if (picks.length < 2) return [];
  const original = money(picks.reduce((s, p) => s + p.cost * MARGIN, 0));
  return [
    {
      id: "REC-S1",
      type: "seasonal",
      title: `عرض «${occ.name}»: ${picks.map(shortName).join(" + ")}`,
      rationale: `مناسبة ${occ.name} تقترب — تجميع منتجات مرتبطة بها بخصم ${occ.discount}% يرفع المبيعات في الذروة الموسمية.`,
      impact: `استغلال ذروة موسمية · خصم ${occ.discount}%`,
      confidence: 0.72,
      status: "pending",
      detail: {
        skus: picks.map((p) => p.sku),
        productTitles: picks.map(shortName),
        originalPrice: original,
        bundlePrice: money(original * (1 - occ.discount / 100)),
        discountPct: occ.discount,
        occasion: occ.name,
      },
    },
  ];
}

/** يولّد تنبيهات إعادة تعبئة المخزون للمنتجات الرائجة قرب النفاد. */
function restockRecs(orders: Order[], products: EnrichedProduct[]): Recommendation[] {
  const sales = salesBySku(orders);
  return products
    .filter((p) => p.stock <= 15 && (sales.get(p.sku) ?? 0) >= 1)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 2)
    .map((p, i) => ({
      id: `REC-R${i + 1}`,
      type: "restock" as const,
      title: `تنبيه مخزون: أعد تعبئة «${shortName(p)}»`,
      rationale: `المخزون منخفض (${p.stock} فقط) والمنتج عليه طلب نشط — خطر نفاد يفقدك مبيعات.`,
      impact: "تفادي فقدان مبيعات بسبب النفاد",
      confidence: 0.85,
      status: "pending" as const,
      detail: { skus: [p.sku], productTitles: [shortName(p)] },
    }));
}

/** يولّد توصية «حزمة حسب الفئة» تجمع منتجات من نفس التصنيف. */
function categoryRecs(products: EnrichedProduct[]): Recommendation[] {
  const byCat = new Map<string, EnrichedProduct[]>();
  for (const p of products) {
    const arr = byCat.get(p.category) ?? [];
    arr.push(p);
    byCat.set(p.category, arr);
  }
  const entry = [...byCat.entries()].filter(([, arr]) => arr.length >= 2).sort((a, b) => b[1].length - a[1].length)[0];
  if (!entry) return [];
  const [cat, items] = entry;
  const picks = items.slice(0, 3);
  const original = money(picks.reduce((s, p) => s + p.cost * MARGIN, 0));
  return [
    {
      id: "REC-CAT1",
      type: "category",
      title: `حزمة فئة «${cat}»: ${picks.map(shortName).join(" + ")}`,
      rationale: `لديك ${items.length} منتجات في فئة «${cat}» — حزمة موضوعية تسهّل الشراء وترفع قيمة الطلب.`,
      impact: "رفع متوسط قيمة الطلب داخل الفئة",
      confidence: 0.65,
      status: "pending",
      detail: {
        skus: picks.map((p) => p.sku),
        productTitles: picks.map(shortName),
        originalPrice: original,
        bundlePrice: money(original * 0.9),
        discountPct: 10,
      },
    },
  ];
}

/** يولّد كل التوصيات من بيانات المتجر. */
export function generateRecommendations(
  raw: RawProduct[],
  products: EnrichedProduct[],
  orders: Order[],
  _platform: PlatformId,
  opts: { month?: number } = {}
): Recommendation[] {
  const month = opts.month ?? 6;
  return [
    ...seasonalRecs(products, month),
    ...bundleRecs(orders, products),
    ...crossSellRecs(orders, products),
    ...restockRecs(orders, products),
    ...categoryRecs(products),
    ...editRecs(raw, products),
    ...priceRecs(products),
  ];
}

/**
 * سجلّ التوصيات السابقة ونتائجها المتحقّقة (لكل تاجر).
 * بيانات تمثيلية تُستبدل بسجلّ فعلي من قاعدة البيانات عند الربط.
 */
export function pastRecommendations(_platform: PlatformId): Recommendation[] {
  return [
    {
      id: "HIST-1",
      type: "bundle",
      title: "حزمة: سماعة بلوتوث + شاحن سريع",
      rationale: "شُوهدا معًا في طلبات متكرّرة.",
      impact: "رفع متوسط قيمة السلة",
      confidence: 0.4,
      status: "approved",
      createdAt: "2026-06-20",
      realized: "+18% متوسط قيمة السلة خلال أسبوعين ✅",
      detail: { skus: ["SKU-1001", "SKU-1002"], productTitles: ["سماعة بلوتوث", "شاحن سريع"], originalPrice: 168, bundlePrice: 151 },
    },
    {
      id: "HIST-2",
      type: "cross_sell",
      title: "خصم 15% على «حافظة جوال» عند شراء «شاحن سريع»",
      rationale: "تحريك مخزون بطيء الحركة.",
      impact: "تصفية مخزون راكد",
      confidence: 0.6,
      status: "approved",
      createdAt: "2026-06-28",
      realized: "بيع 60% من مخزون الحافظات الراكد 📦",
      detail: { skus: ["SKU-1002", "SKU-1007"], productTitles: ["شاحن سريع", "حافظة جوال"] },
    },
    {
      id: "HIST-3",
      type: "price",
      title: "رفع سعر «عطر عود فاخر» بنسبة 8%",
      rationale: "فئة عالية القيمة تحتمل هامشًا أعلى.",
      impact: "زيادة الربح لكل قطعة",
      confidence: 0.55,
      status: "rejected",
      createdAt: "2026-07-02",
      realized: "—",
      detail: { skus: ["SKU-1004"], productTitles: ["عطر عود فاخر"] },
    },
  ];
}
