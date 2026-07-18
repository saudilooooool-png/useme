"use client";

import type { Recommendation } from "@distrios/core";
import { useReco } from "../RecommendationsContext";

const TYPE_LABEL: Record<Recommendation["type"], string> = {
  seasonal: "موسمية",
  bundle: "حزمة",
  cross_sell: "خصم تقاطعي",
  restock: "تنبيه مخزون",
  category: "حزمة فئة",
  edit: "تحسين بيانات",
  price: "تسعير",
};

export function HistoryScreen() {
  const { history, recommendations } = useReco();
  const decidedNow = recommendations.filter((r) => r.status !== "pending");

  const approvedCount = [...history, ...decidedNow].filter((r) => r.status === "approved").length;
  const rejectedCount = [...history, ...decidedNow].filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="إجمالي التوصيات" value={history.length + recommendations.length} />
        <Stat label="مُطبّقة (موافَق)" value={approvedCount} tone="emerald" />
        <Stat label="مرفوضة" value={rejectedCount} tone="rose" />
      </div>

      <div>
        <h3 className="mb-3 font-bold text-slate-900">التوصيات السابقة ونتائجها</h3>
        <div className="space-y-3">
          {history.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-100 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {TYPE_LABEL[r.type]}
                  </span>
                  <span className="ms-2 text-xs text-slate-400">{r.createdAt}</span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    r.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {r.status === "approved" ? "معتمدة ✓" : "مرفوضة ✕"}
                </span>
              </div>
              <h4 className="mt-2 font-bold text-slate-900">{r.title}</h4>
              {r.status === "approved" ? (
                <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                  النتيجة المتحقّقة: {r.realized}
                </div>
              ) : (
                <div className="mt-2 text-sm text-slate-400">لم تُطبّق — {r.rationale}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {decidedNow.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-400">قراراتك في الجلسة الحالية</h4>
          <div className="space-y-2">
            {decidedNow.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="text-slate-700">{r.title}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    r.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {r.status === "approved" ? "معتمدة ✓" : "مرفوضة ✕"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "emerald" | "rose" }) {
  const c = tone === "emerald" ? "text-emerald-600" : tone === "rose" ? "text-rose-600" : "text-slate-900";
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 text-center">
      <div className={`text-2xl font-extrabold ${c}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
