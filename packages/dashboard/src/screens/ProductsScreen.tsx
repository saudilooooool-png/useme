"use client";

import { useState } from "react";
import { enrichBatch, RAW_PRODUCTS, type EnrichedProduct } from "@distrios/core";

export function ProductsScreen() {
  const [products, setProducts] = useState<EnrichedProduct[] | null>(null);
  const [processing, setProcessing] = useState(false);

  function runProcessing() {
    setProcessing(true);
    // محاكاة زمن معالجة الذكاء الاصطناعي.
    setTimeout(() => {
      setProducts(enrichBatch(RAW_PRODUCTS));
      setProcessing(false);
    }, 700);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
          ⬆
        </div>
        <h3 className="mt-4 font-bold text-slate-900">ارفع ملف المنتجات الخام</h3>
        <p className="mt-1 text-sm text-slate-500">
          CSV أو Excel أو اربط نظام الـ ERP — سيعالج الذكاء الاصطناعي البيانات ويولّد عناوين
          ووصفًا وتصنيفات وسمات محسّنة.
        </p>
        <button
          onClick={runProcessing}
          disabled={processing}
          className="mt-5 rounded-lg bg-brand-600 px-6 py-2.5 font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {processing ? "جارٍ المعالجة…" : `معالجة ${RAW_PRODUCTS.length} منتجًا تجريبيًا`}
        </button>
      </div>

      {products && (
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
          <table className="w-full text-start text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3 text-start font-medium">SKU</th>
                <th className="p-3 text-start font-medium">العنوان المحسّن (SEO)</th>
                <th className="p-3 text-start font-medium">التصنيف</th>
                <th className="p-3 text-start font-medium">السمات</th>
                <th className="p-3 text-start font-medium">الجودة</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.sku} className="border-t border-slate-100 align-top">
                  <td className="p-3 font-mono text-xs text-slate-400">{p.sku}</td>
                  <td className="p-3 font-medium text-slate-900">{p.title}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-slate-500">
                    {Object.entries(p.attributes).map(([k, v]) => `${k}: ${v}`).join("، ") || "—"}
                  </td>
                  <td className="p-3">
                    <QualityBadge score={p.qualityScore} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function QualityBadge({ score }: { score: number }) {
  const color =
    score >= 85 ? "bg-emerald-100 text-emerald-700" : score >= 65 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${color}`}>{score}%</span>;
}
