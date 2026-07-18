"use client";

import { useMemo } from "react";
import { buildAllBundles, enrichBatch, mockOrders, RAW_PRODUCTS } from "@distrios/core";
import { formatSAR, formatPercent } from "@distrios/ui";
import { usePlatform } from "../PlatformContext";

export function BundlesScreen() {
  const platform = usePlatform();
  const bundles = useMemo(() => {
    const products = enrichBatch(RAW_PRODUCTS);
    return buildAllBundles(mockOrders(platform.id), products);
  }, [platform.id]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="font-bold text-slate-900">الحزم الذكية واستعادة المخزون الراكد</h3>
        <p className="text-sm text-slate-500">
          حزم مُولّدة تلقائيًا من تحليل سلوك الشراء ومستويات المخزون لرفع متوسط قيمة الطلب
          وتصفية المنتجات بطيئة الحركة.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {bundles.map((b) => {
          const saving = b.originalPrice - b.bundlePrice;
          return (
            <div key={b.id} className="rounded-xl border border-slate-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    b.kind === "behavioral"
                      ? "bg-brand-50 text-brand-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {b.kind === "behavioral" ? "تجميع سلوكي" : "استعادة مخزون راكد"}
                </span>
                <span className="text-xs text-slate-400">
                  تحويل متوقّع {formatPercent(b.expectedConversion)}
                </span>
              </div>
              <h4 className="mt-3 font-bold text-slate-900">{b.title}</h4>
              <p className="mt-1 text-sm text-slate-500">{b.reason}</p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-xl font-extrabold text-slate-900">{formatSAR(b.bundlePrice)}</span>
                <span className="text-sm text-slate-400 line-through">{formatSAR(b.originalPrice)}</span>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  توفير {formatSAR(saving)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
