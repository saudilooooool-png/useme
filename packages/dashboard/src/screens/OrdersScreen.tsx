"use client";

import { useState } from "react";
import { fulfillOrder, mockOrders, type Order } from "@distrios/core";
import { formatSAR } from "@distrios/ui";
import { usePlatform } from "../PlatformContext";
import { statusLabel } from "./OverviewScreen";

type WaEvent = "order_confirmed" | "order_shipped" | "invoice";
interface WaState {
  orderId: string;
  message: string;
  sent: boolean;
}

export function OrdersScreen() {
  const platform = usePlatform();
  const [orders, setOrders] = useState<Order[]>(() => mockOrders(platform.id));
  const [wa, setWa] = useState<WaState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function fulfill(id: string, index: number) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? fulfillOrder(o, index + 1) : o))
    );
  }

  async function notify(order: Order, event: WaEvent) {
    setBusy(`${order.id}:${event}`);
    try {
      const res = await fetch("/api/whatsapp/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, platform: platform.id, event }),
      });
      const data = (await res.json()) as { message: string; sent: boolean };
      setWa({ orderId: order.id, message: data.message, sent: data.sent });
    } catch {
      setWa({ orderId: order.id, message: "تعذّر الاتصال بخدمة الواتساب.", sent: false });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="font-bold text-slate-900">الطلبات المركزية</h3>
        <p className="text-sm text-slate-500">
          كل الطلبات من {platform.nameAr} في مكان واحد. اضغط «تجهيز» لتوليد بوليصة الشحن (AWB)
          والفاتورة المتوافقة مع «فاتورة» (ZATCA)، ثم أرسل إشعارًا للعميل عبر واتساب.
        </p>
      </div>

      <div className="space-y-3">
        {orders.map((o, i) => (
          <div key={o.id} className="rounded-xl border border-slate-100 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{o.id}</span>
                  <StatusPill status={o.status} />
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {o.customerName} · {o.city} · {o.createdAt}
                </div>
                <ul className="mt-2 text-sm text-slate-600">
                  {o.items.map((it) => (
                    <li key={it.sku}>
                      {it.title} × {it.qty} — {formatSAR(it.price * it.qty)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-end">
                <div className="text-lg font-extrabold text-slate-900">{formatSAR(o.total)}</div>
                {o.awb ? (
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <div>AWB: <span className="font-mono text-slate-700">{o.awb}</span></div>
                    <div>فاتورة: <span className="font-mono text-slate-700">{o.invoiceId}</span></div>
                  </div>
                ) : (
                  <button
                    onClick={() => fulfill(o.id, i)}
                    className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    تجهيز وشحن
                  </button>
                )}
              </div>
            </div>

            {/* أزرار إشعارات واتساب */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-emerald-700">💬 إشعار واتساب:</span>
              <WaButton label="تأكيد الطلب" active={busy === `${o.id}:order_confirmed`} onClick={() => notify(o, "order_confirmed")} />
              <WaButton label="تم الشحن" active={busy === `${o.id}:order_shipped`} onClick={() => notify(o, "order_shipped")} />
              <WaButton label="الفاتورة" active={busy === `${o.id}:invoice`} onClick={() => notify(o, "invoice")} />
            </div>

            {wa?.orderId === o.id && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="mb-1 text-xs font-bold text-emerald-800">
                  {wa.sent ? "✅ أُرسلت عبر واتساب" : "👁 معاينة الرسالة (وضع المحاكاة — اضبط WHATSAPP_TOKEN للإرسال الحقيقي)"}
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{wa.message}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WaButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={active}
      className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
    >
      {active ? "…" : label}
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    processing: "bg-amber-100 text-amber-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${map[status] ?? "bg-slate-100 text-slate-600"}`}>
      {statusLabel(status)}
    </span>
  );
}
