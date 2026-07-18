"use client";

import { useMemo, useState } from "react";
import { calculatePrice, enrichBatch, RAW_PRODUCTS } from "@distrios/core";
import { formatSAR } from "@distrios/ui";
import { usePlatform } from "../PlatformContext";

export function PricingScreen() {
  const platform = usePlatform();
  const [margin, setMargin] = useState(40);
  const products = useMemo(() => enrichBatch(RAW_PRODUCTS), []);

  const quotes = useMemo(
    () =>
      products.map((p) =>
        calculatePrice({
          sku: p.sku,
          cost: p.cost,
          targetMargin: margin / 100,
          platform: platform.id,
        })
      ),
    [products, margin, platform.id]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900">التسعير الديناميكي</h3>
            <p className="text-sm text-slate-500">
              يُحسب السعر الأمثل تلقائيًا بعد خصم رسوم {platform.nameAr} (عمولة{" "}
              {Math.round(platform.fees.commissionRate * 100)}% + دفع{" "}
              {Math.round(platform.fees.paymentRate * 100)}%) وإضافة ضريبة القيمة المضافة 15%.
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">هامش الربح</span>
            <input
              type="range"
              min={10}
              max={80}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="accent-brand-600"
            />
            <span className="w-10 font-bold text-brand-600">{margin}%</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 text-start font-medium">المنتج</th>
              <th className="p-3 text-start font-medium">التكلفة</th>
              <th className="p-3 text-start font-medium">سعر البيع (شامل الضريبة)</th>
              <th className="p-3 text-start font-medium">العمولة</th>
              <th className="p-3 text-start font-medium">صافي الربح</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q, i) => (
              <tr key={q.sku} className="border-t border-slate-100">
                <td className="p-3 font-medium text-slate-900">{products[i].title.split("—")[0]}</td>
                <td className="p-3 text-slate-500">{formatSAR(q.cost)}</td>
                <td className="p-3 font-bold text-slate-900">{formatSAR(q.sellingPrice)}</td>
                <td className="p-3 text-slate-500">{formatSAR(q.breakdown.commission)}</td>
                <td className="p-3 font-bold text-emerald-600">{formatSAR(q.netProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
