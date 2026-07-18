"use client";

import { useState } from "react";
import { fulfillOrder, mockOrders, type Order } from "@distrios/core";
import { formatSAR } from "@distrios/ui";
import { usePlatform } from "../PlatformContext";
import { statusLabel } from "./OverviewScreen";

export function OrdersScreen() {
  const platform = usePlatform();
  const [orders, setOrders] = useState<Order[]>(() => mockOrders(platform.id));

  function fulfill(id: string, index: number) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? fulfillOrder(o, index + 1) : o))
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="font-bold text-slate-900">الطلبات المركزية</h3>
        <p className="text-sm text-slate-500">
          كل الطلبات من {platform.nameAr} في مكان واحد. اضغط «تجهيز» لتوليد بوليصة الشحن (AWB)
          والفاتورة المتوافقة مع «فاتورة» (ZATCA) تلقائيًا.
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
          </div>
        ))}
      </div>
    </div>
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
