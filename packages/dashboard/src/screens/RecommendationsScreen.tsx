"use client";

import type { Recommendation } from "@distrios/core";
import { formatSAR } from "@distrios/ui";
import { useReco } from "../RecommendationsContext";

const TYPE_META: Record<Recommendation["type"], { label: string; color: string; icon: string }> = {
  bundle: { label: "حزمة", color: "bg-brand-50 text-brand-700", icon: "◈" },
  cross_sell: { label: "خصم تقاطعي", color: "bg-amber-100 text-amber-700", icon: "⇄" },
  edit: { label: "تحسين بيانات", color: "bg-sky-100 text-sky-700", icon: "✎" },
  price: { label: "تسعير", color: "bg-emerald-100 text-emerald-700", icon: "﷼" },
};

export function RecommendationsScreen() {
  const { recommendations, loading, loaded, aiPowered, load, setStatus } = useReco();
  const pending = recommendations.filter((r) => r.status === "pending");
  const decided = recommendations.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-5">
        <div>
          <h3 className="font-bold text-slate-900">توصيات الذكاء الاصطناعي</h3>
          <p className="text-sm text-slate-500">
            يحلّل الذكاء الاصطناعي بيانات متجرك ويقترح إجراءات — وافق أو ارفض كلًّا منها.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "جارٍ التحليل…" : loaded ? "إعادة التحليل" : "حلّل متجري وولّد التوصيات"}
        </button>
      </div>

      {loaded && aiPowered !== null && (
        <div
          className={`rounded-lg border px-4 py-2 text-sm ${
            aiPowered
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {aiPowered
            ? "✦ التوصيات مُحسّنة بنموذج Claude الحقيقي."
            : "⚙ توصيات المحرك الاحتياطي. لتفعيل Claude اضبط ANTHROPIC_API_KEY."}
        </div>
      )}

      {!loaded && !loading && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          اضغط «حلّل متجري» ليبدأ الذكاء الاصطناعي بفحص بياناتك واقتراح التحسينات.
        </div>
      )}

      {pending.map((r) => (
        <RecoCard key={r.id} r={r} onApprove={() => setStatus(r.id, "approved")} onReject={() => setStatus(r.id, "rejected")} />
      ))}

      {decided.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-400">تمّت مراجعتها</h4>
          {decided.map((r) => (
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
      )}
    </div>
  );
}

function RecoCard({ r, onApprove, onReject }: { r: Recommendation; onApprove: () => void; onReject: () => void }) {
  const meta = TYPE_META[r.type];
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${meta.color}`}>
          {meta.icon} {meta.label}
        </span>
        <span className="text-xs text-slate-400">ثقة {Math.round(r.confidence * 100)}%</span>
      </div>

      <h4 className="mt-3 font-bold text-slate-900">{r.title}</h4>
      <p className="mt-1 text-sm text-slate-500">
        <span className="font-medium text-slate-600">السبب: </span>
        {r.rationale}
      </p>

      <RecoDetail r={r} />

      <div className="mt-3 flex items-center justify-between">
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
          الأثر المتوقّع: {r.impact}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            رفض
          </button>
          <button
            onClick={onApprove}
            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            موافقة
          </button>
        </div>
      </div>
    </div>
  );
}

function RecoDetail({ r }: { r: Recommendation }) {
  const d = r.detail;
  if (r.type === "bundle" && d.bundlePrice != null) {
    return (
      <div className="mt-3 flex items-baseline gap-3 rounded-lg bg-slate-50 p-3">
        <span className="text-lg font-extrabold text-slate-900">{formatSAR(d.bundlePrice)}</span>
        <span className="text-sm text-slate-400 line-through">{formatSAR(d.originalPrice ?? 0)}</span>
        <span className="text-xs text-slate-500">سعر الحزمة المقترح</span>
      </div>
    );
  }
  if (r.type === "cross_sell" && d.proposedPrice != null) {
    return (
      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
        عند شراء «{d.triggerTitle}» → «{d.targetTitle}» بـ{" "}
        <span className="font-bold text-emerald-600">{formatSAR(d.proposedPrice)}</span>{" "}
        <span className="text-slate-400 line-through">{formatSAR(d.currentPrice ?? 0)}</span>
      </div>
    );
  }
  if (r.type === "price" && d.proposedPrice != null) {
    return (
      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
        السعر: <span className="text-slate-400 line-through">{formatSAR(d.currentPrice ?? 0)}</span> →{" "}
        <span className="font-bold text-emerald-600">{formatSAR(d.proposedPrice)}</span>
      </div>
    );
  }
  if (r.type === "edit" && d.fieldChanges) {
    return (
      <div className="mt-3 space-y-1 rounded-lg bg-slate-50 p-3 text-xs">
        {d.fieldChanges.map((f) => (
          <div key={f.field}>
            <span className="font-bold text-slate-600">{f.field}:</span>{" "}
            <span className="text-emerald-700">{f.to}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
