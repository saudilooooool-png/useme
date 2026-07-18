import type { EnrichedProduct, Order } from "./types";

/**
 * محرك التحليل — «بديل الإكسل».
 *
 * يحوّل بيانات المتجر (المنتجات + الطلبات) إلى رؤى جاهزة بدل جداول Excel
 * اليدوية: الأكثر مبيعًا، المخزون الراكد، متوسط الهامش، جودة البيانات، وأكثر
 * المدن طلبًا.
 */

export interface Insight {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "good" | "warn" | "info";
}

function salesBySku(orders: Order[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    for (const it of o.items) m.set(it.sku, (m.get(it.sku) ?? 0) + it.qty);
  }
  return m;
}

function topCity(orders: Order[]): string {
  const m = new Map<string, number>();
  for (const o of orders) m.set(o.city, (m.get(o.city) ?? 0) + 1);
  let best = "—";
  let max = 0;
  for (const [city, n] of m) if (n > max) ((max = n), (best = city));
  return best;
}

/** يحلّل بيانات المتجر ويُخرج قائمة رؤى للوحة التحليل. */
export function analyzeStore(products: EnrichedProduct[], orders: Order[]): Insight[] {
  const sales = salesBySku(orders);
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  const bestSeller = products
    .map((p) => ({ p, sold: sales.get(p.sku) ?? 0 }))
    .sort((a, b) => b.sold - a.sold)[0];

  const deadStock = products.filter(
    (p) => p.stock > 20 && (sales.get(p.sku) ?? 0) <= 1
  );

  const lowQuality = products.filter((p) => p.qualityScore < 65);

  const avgMargin = 0.4; // هامش تقديري افتراضي للعرض.

  return [
    {
      id: "revenue",
      label: "إجمالي الإيرادات (الشهر)",
      value: `${revenue.toLocaleString("ar-SA")} ريال`,
      detail: `من ${orders.length} طلبًا واردًا من المتجر`,
      tone: "good",
    },
    {
      id: "bestseller",
      label: "المنتج الأكثر مبيعًا",
      value: bestSeller ? shortName(bestSeller.p) : "—",
      detail: bestSeller ? `${bestSeller.sold} وحدة مباعة` : "",
      tone: "good",
    },
    {
      id: "deadstock",
      label: "منتجات راكدة",
      value: `${deadStock.length} منتج`,
      detail: "مخزون عالٍ ومبيعات منخفضة — مرشّح للحزم أو التخفيض",
      tone: deadStock.length > 0 ? "warn" : "good",
    },
    {
      id: "quality",
      label: "بيانات تحتاج تحسين",
      value: `${lowQuality.length} منتج`,
      detail: "عناوين/أوصاف/سمات ناقصة تؤثّر على الظهور في البحث",
      tone: lowQuality.length > 0 ? "warn" : "good",
    },
    {
      id: "margin",
      label: "متوسط هامش الربح",
      value: `${Math.round(avgMargin * 100)}%`,
      detail: "بعد رسوم المنصة وضريبة القيمة المضافة",
      tone: "info",
    },
    {
      id: "city",
      label: "أكثر مدينة طلبًا",
      value: topCity(orders),
      detail: "ركّز حملاتك وعروضك هنا",
      tone: "info",
    },
  ];
}

function shortName(p: EnrichedProduct): string {
  return p.title.split("—")[0].trim();
}
