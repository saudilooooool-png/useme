import type { Order, PlatformId } from "./types";
import { getPlatform } from "./platforms";

/**
 * محرك الطلبات المركزية.
 *
 * يولّد رقم بوليصة الشحن (AWB) ورقم الفاتورة المتوافق مع نظام "فاتورة"
 * (ZATCA) لكل طلب. المنطق هنا محاكاة لأغراض العرض؛ عند الربط الحقيقي
 * تُستدعى واجهات شركات الشحن ومنصة الفوترة الإلكترونية.
 */

/** يولّد رقم بوليصة شحن وهمي بناءً على المنصة وشركة الشحن. */
export function generateAwb(platform: PlatformId, seed: number): string {
  const p = getPlatform(platform);
  const courier = p.couriers[seed % p.couriers.length];
  const prefix = courier === "أرامكس" ? "ARX" : courier === "سمسا" ? "SMS" : "SHP";
  const number = String(100000000 + ((seed * 7919) % 899999999));
  return `${prefix}-${number}`;
}

/** يولّد رقم فاتورة متوافق مع تسلسل "فاتورة" (ZATCA). */
export function generateInvoiceId(platform: PlatformId, seed: number): string {
  const year = 2026;
  const serial = String(1000 + seed).padStart(6, "0");
  return `INV-${platform.toUpperCase()}-${year}-${serial}`;
}

/** يجهّز طلبًا للشحن: يولّد AWB والفاتورة ويحدّث الحالة. */
export function fulfillOrder(order: Order, seed: number): Order {
  return {
    ...order,
    awb: order.awb ?? generateAwb(order.platform, seed),
    invoiceId: order.invoiceId ?? generateInvoiceId(order.platform, seed),
    status: order.status === "new" ? "processing" : order.status,
  };
}

export interface OrderSummary {
  total: number;
  count: number;
  byStatus: Record<string, number>;
  revenue: number;
}

/** يحسب ملخصًا لمجموعة طلبات للوحة التحكم. */
export function summarizeOrders(orders: Order[]): OrderSummary {
  const byStatus: Record<string, number> = {};
  let revenue = 0;
  for (const order of orders) {
    byStatus[order.status] = (byStatus[order.status] ?? 0) + 1;
    if (order.status !== "cancelled") revenue += order.total;
  }
  return {
    total: orders.length,
    count: orders.length,
    byStatus,
    revenue: Math.round(revenue * 100) / 100,
  };
}
