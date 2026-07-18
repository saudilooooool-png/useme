import type { Bundle, EnrichedProduct, Order } from "./types";

/**
 * محرك الحزم الذكية واستعادة المخزون الراكد.
 *
 * 1) التجميع السلوكي: يحلّل سجل الطلبات لإيجاد المنتجات التي تُشترى معًا
 *    بشكل متكرر (co-purchase) ويقترح حزمًا ذات معدل تحويل مرتفع.
 * 2) استعادة المخزون الراكد: يربط المنتجات بطيئة الحركة بالمنتجات الأكثر
 *    مبيعًا لتصفية المخزون دون خفض كبير في السعر.
 */

interface PairStat {
  a: string;
  b: string;
  count: number;
}

function countCoPurchases(orders: Order[]): PairStat[] {
  const pairs = new Map<string, number>();
  for (const order of orders) {
    const skus = Array.from(new Set(order.items.map((i) => i.sku))).sort();
    for (let i = 0; i < skus.length; i++) {
      for (let j = i + 1; j < skus.length; j++) {
        const key = `${skus[i]}|${skus[j]}`;
        pairs.set(key, (pairs.get(key) ?? 0) + 1);
      }
    }
  }
  return Array.from(pairs.entries())
    .map(([key, count]) => {
      const [a, b] = key.split("|");
      return { a, b, count };
    })
    .sort((x, y) => y.count - x.count);
}

function salesCount(orders: Order[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      counts.set(item.sku, (counts.get(item.sku) ?? 0) + item.qty);
    }
  }
  return counts;
}

const BEHAVIORAL_DISCOUNT = 0.1; // خصم 10% على الحزمة السلوكية.
const BLOCKED_DISCOUNT = 0.15; // خصم 15% لتحريك المخزون الراكد.

/** يولّد حزمًا سلوكية من المنتجات التي تُشترى معًا. */
export function buildBehavioralBundles(
  orders: Order[],
  products: EnrichedProduct[],
  limit = 3
): Bundle[] {
  const byId = new Map(products.map((p) => [p.sku, p]));
  const pairs = countCoPurchases(orders).filter((p) => p.count >= 2);

  return pairs.slice(0, limit).map((pair, idx) => {
    const a = byId.get(pair.a);
    const b = byId.get(pair.b);
    const original = (priceOf(a) + priceOf(b));
    return {
      id: `BND-B${idx + 1}`,
      title: `حزمة: ${shortName(a)} + ${shortName(b)}`,
      skus: [pair.a, pair.b],
      kind: "behavioral",
      originalPrice: round(original),
      bundlePrice: round(original * (1 - BEHAVIORAL_DISCOUNT)),
      expectedConversion: Math.min(0.45, 0.15 + pair.count * 0.03),
      reason: `تم شراؤهما معًا في ${pair.count} طلبات — حزمة عالية التحويل.`,
    };
  });
}

/** يربط المنتجات الراكدة بالأكثر مبيعًا لتصفية المخزون. */
export function buildBlockedStockBundles(
  orders: Order[],
  products: EnrichedProduct[],
  limit = 3
): Bundle[] {
  const sales = salesCount(orders);
  const withSales = products.map((p) => ({ p, sold: sales.get(p.sku) ?? 0 }));
  const bestSellers = [...withSales].sort((a, b) => b.sold - a.sold);
  // الراكد = مخزون عالٍ ومبيعات منخفضة.
  const slow = [...withSales]
    .filter((x) => x.p.stock > 20 && x.sold <= 1)
    .sort((a, b) => b.p.stock - a.p.stock);

  return slow.slice(0, limit).map((slowItem, idx) => {
    const anchor = bestSellers[idx % bestSellers.length].p;
    const original = priceOf(slowItem.p) + priceOf(anchor);
    return {
      id: `BND-S${idx + 1}`,
      title: `عرض تصفية: ${shortName(anchor)} + ${shortName(slowItem.p)}`,
      skus: [anchor.sku, slowItem.p.sku],
      kind: "blocked-stock",
      originalPrice: round(original),
      bundlePrice: round(original * (1 - BLOCKED_DISCOUNT)),
      expectedConversion: 0.22,
      reason: `${shortName(slowItem.p)} راكد (مخزون ${slowItem.p.stock}) — مدموج مع منتج سريع الحركة.`,
    };
  });
}

export function buildAllBundles(orders: Order[], products: EnrichedProduct[]): Bundle[] {
  return [
    ...buildBehavioralBundles(orders, products),
    ...buildBlockedStockBundles(orders, products),
  ];
}

// تسعير تقريبي للعرض: التكلفة + هامش 40%.
function priceOf(p?: EnrichedProduct): number {
  return p ? p.cost * 1.4 : 0;
}

function shortName(p?: EnrichedProduct): string {
  if (!p) return "منتج";
  return p.title.split("—")[0].trim();
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
