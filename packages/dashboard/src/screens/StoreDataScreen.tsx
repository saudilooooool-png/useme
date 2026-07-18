"use client";

import { useMemo, useState } from "react";
import { enrichBatch, mockOrders, RAW_PRODUCTS, type Order } from "@distrios/core";
import { formatSAR } from "@distrios/ui";
import { usePlatform } from "../PlatformContext";
import { statusLabel } from "./OverviewScreen";

/**
 * عرض بيانات المتجر المتّصل (منتجات + طلبات) للقراءة فقط — المتجر يتولّى
 * الشحن والفوترة تلقائيًا؛ هذه مجرد مرآة للبيانات التي تعمل عليها طبقة الذكاء.
 */
export function StoreDataScreen() {
  const platform = usePlatform();
  const products = useMemo(() => enrichBatch(RAW_PRODUCTS), []);
  const orders = useMemo(() => mockOrders(platform.id), [platform.id]);
  const [wa, setWa] = useState<{ id: string; message: string; sent: boolean } | null>(null);

  async function notify(order: Order) {
    const res = await fetch("/api/whatsapp/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id, platform: platform.id, event: "order_shipped" }),
    });
    const data = (await res.json()) as { message: string; sent: boolean };
    setWa({ id: order.id, message: data.message, sent: data.sent });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-white p-5 text-sm text-slate-500">
        بيانات مزامَنة من متجرك على <span className="font-bold text-slate-700">{platform.nameAr}</span>
        {" "}— الطلبات والشحن ({platform.couriers.slice(0, 2).join("، ")}) والفوترة تُدار داخل المتجر. للقراءة فقط.
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold text-slate-400">المنتجات ({products.length})</h4>
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-start text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3 text-start font-medium">المنتج</th>
                <th className="p-3 text-start font-medium">التصنيف</th>
                <th className="p-3 text-start font-medium">المخزون</th>
                <th className="p-3 text-start font-medium">التكلفة</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.sku} className="border-t border-slate-100">
                  <td className="p-3 font-medium text-slate-900">{p.title.split("—")[0].trim()}</td>
                  <td className="p-3 text-slate-500">{p.category}</td>
                  <td className="p-3 text-slate-500">{p.stock}</td>
                  <td className="p-3 text-slate-500">{formatSAR(p.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold text-slate-400">أحدث الطلبات ({orders.length})</h4>
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="rounded-lg border border-slate-100 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <span className="font-bold text-slate-900">{o.id}</span>
                  <span className="ms-2 text-slate-500">{o.customerName} · {o.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{statusLabel(o.status)}</span>
                  <span className="font-bold text-slate-900">{formatSAR(o.total)}</span>
                  <button
                    onClick={() => notify(o)}
                    className="rounded-full border border-emerald-300 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    💬 إشعار العميل
                  </button>
                </div>
              </div>
              {wa?.id === o.id && (
                <pre className="mt-2 whitespace-pre-wrap rounded bg-emerald-50 p-2 font-sans text-xs text-slate-700">
                  {wa.sent ? "✅ أُرسلت: " : "👁 معاينة: "}
                  {wa.message}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
