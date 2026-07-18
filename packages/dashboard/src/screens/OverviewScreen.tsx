"use client";

import { useMemo } from "react";
import {
  enrichBatch,
  mockOrders,
  RAW_PRODUCTS,
  summarizeOrders,
} from "@distrios/core";
import { formatSAR } from "@distrios/ui";
import { usePlatform } from "../PlatformContext";

export function OverviewScreen() {
  const platform = usePlatform();
  const { products, summary } = useMemo(() => {
    const products = enrichBatch(RAW_PRODUCTS);
    const summary = summarizeOrders(mockOrders(platform.id));
    return { products, summary };
  }, [platform.id]);

  const avgQuality = Math.round(
    products.reduce((s, p) => s + p.qualityScore, 0) / products.length
  );

  const cards = [
    { label: "المنتجات المنشورة", value: String(products.length), hint: "من ملف مرفوع واحد" },
    { label: "الطلبات", value: String(summary.total), hint: `عبر ${platform.nameAr}` },
    { label: "الإيرادات", value: formatSAR(summary.revenue), hint: "هذا الشهر" },
    { label: "جودة البيانات", value: `${avgQuality}%`, hint: "متوسط درجة الإثراء" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-100 bg-white p-5">
            <div className="text-sm text-slate-500">{c.label}</div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">{c.value}</div>
            <div className="mt-1 text-xs text-slate-400">{c.hint}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <h3 className="font-bold text-slate-900">الطلبات حسب الحالة</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Object.entries(summary.byStatus).map(([status, count]) => (
            <div key={status} className="rounded-lg bg-slate-50 p-3 text-center">
              <div className="text-xl font-bold text-slate-900">{count}</div>
              <div className="text-xs text-slate-500">{statusLabel(status)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    new: "جديد",
    processing: "قيد التجهيز",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغى",
  };
  return map[status] ?? status;
}
