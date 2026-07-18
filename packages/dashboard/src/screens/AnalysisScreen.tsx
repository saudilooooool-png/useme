"use client";

import { useMemo } from "react";
import { analyzeStore, enrichBatch, mockOrders, RAW_PRODUCTS } from "@distrios/core";
import { usePlatform } from "../PlatformContext";

export function AnalysisScreen() {
  const platform = usePlatform();
  const insights = useMemo(
    () => analyzeStore(enrichBatch(RAW_PRODUCTS), mockOrders(platform.id)),
    [platform.id]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2 font-bold text-emerald-800">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-xs text-white">✓</span>
          متجرك على {platform.nameAr} متّصل وجاهز
        </div>
        <p className="mt-1 text-sm text-emerald-700">
          الطلبات وشركات الشحن ({platform.couriers.slice(0, 3).join("، ")}) تعمل تلقائيًا داخل متجرك.
          هذه اللوحة طبقة تحليل وتوصيات ذكية <span className="font-bold">فوق</span> متجرك — بديل ذكي لتحليل الإكسل اليدوي.
        </p>
      </div>

      <div>
        <h3 className="mb-3 font-bold text-slate-900">تحليل بيانات المتجر</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className={`rounded-xl border bg-white p-5 ${
                ins.tone === "warn"
                  ? "border-amber-200"
                  : ins.tone === "good"
                  ? "border-emerald-100"
                  : "border-slate-100"
              }`}
            >
              <div className="text-sm text-slate-500">{ins.label}</div>
              <div
                className={`mt-2 text-2xl font-extrabold ${
                  ins.tone === "warn" ? "text-amber-600" : "text-slate-900"
                }`}
              >
                {ins.value}
              </div>
              <div className="mt-1 text-xs text-slate-400">{ins.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
