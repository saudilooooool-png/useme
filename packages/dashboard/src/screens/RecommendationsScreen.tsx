"use client";

import type { Recommendation } from "@distrios/core";
import { formatSAR } from "@distrios/ui";
import { useReco } from "../RecommendationsContext";

const TYPE_META: Record<Recommendation["type"], { label: string; color: string; icon: string }> = {
  seasonal: { label: "موسمية", color: "bg-rose-100 text-rose-700", icon: "🗓" },
  bundle: { label: "حزمة", color: "bg-brand-50 text-brand-700", icon: "◈" },
  cross_sell: { label: "خصم تقاطعي", color: "bg-amber-100 text-amber-700", icon: "⇄" },
  restock: { label: "تنبيه مخزون", color: "bg-orange-100 text-orange-700", icon: "⚠" },
  category: { label: "حزمة فئة", color: "bg-indigo-100 text-indigo-700", icon: "🏷" },
  edit: { label: "تحسين بيانات", color: "bg-sky-100 text-sky-700", icon: "✎" },
  price: { label: "تسعير", color: "bg-emerald-100 text-emerald-700", icon: "﷼" },
};

export function RecommendationsScreen() {
  const { recommendations, loading, loaded, aiPowered, load, setStatus } = useReco();
  const pending = recommendations.filter((r) => r.status === "pending");
  const approved = recommendations.filter((r) => r.status === "approved");
  const rejected = recommendations.filter((r) => r.status === "rejected");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-5">
        <div>
          <h3 className="font-bold text-slate-900">توصيات الذكاء الاصطناعي</h3>
          <p className="text-sm text-slate-500">
            يحلّل الذكاء الاصطناعي بيانات متجرك ويقترح إجراءات — وافق أو ارفض كلًّا منها.
            قراراتك محفوظة لحسابك.
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

      {loaded && (
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="قيد الانتظار" value={pending.length} tone="amber" />
          <StatBox label="تمت الموافقة" value={approved.length} tone="emerald" />
          <StatBox label="مرفوضة" value={rejected.length} tone="rose" />
        </div>
      )}

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

      {pending.length > 0 && (
        <Section title="قيد انتظار التأكيد">
          {pending.map((r) => (
            <RecoCard
              key={r.id}
              r={r}
              onApprove={() => setStatus(r.id, "approved")}
              onReject={() => setStatus(r.id, "rejected")}
            />
          ))}
        </Section>
      )}

      {approved.length > 0 && (
        <Section title="تمت الموافقة">
          {approved.map((r) => (
            <DecidedRow key={r.id} r={r} onUndo={() => setStatus(r.id, "pending")} />
          ))}
        </Section>
      )}

      {rejected.length > 0 && (
        <Section title="مرفوضة">
          {rejected.map((r) => (
            <DecidedRow key={r.id} r={r} onUndo={() => setStatus(r.id, "pending")} />
          ))}
        </Section>
      )}
    </div>
  );
}

function StatBox({ label, value, tone }: { label: string; value: number; tone: "amber" | "emerald" | "rose" }) {
  const c = {
    amber: "border-amber-200 text-amber-600",
    emerald: "border-emerald-200 text-emerald-600",
    rose: "border-rose-200 text-rose-600",
  }[tone];
  return (
    <div className={`rounded-xl border bg-white p-4 text-center ${c}`}>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-slate-400">{title}</h4>
      {children}
    </div>
  );
}

function DecidedRow({ r, onUndo }: { r: Recommendation; onUndo: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
      <span className="text-slate-700">{TYPE_META[r.type].icon} {r.title}</span>
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            r.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {r.status === "approved" ? "معتمدة ✓" : "مرفوضة ✕"}
        </span>
        <button onClick={onUndo} className="text-xs text-slate-400 hover:text-slate-600">
          تراجع
        </button>
      </div>
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
  const isOfferLike = r.type === "bundle" || r.type === "seasonal" || r.type === "category";
  if (isOfferLike && d.bundlePrice != null) {
    return (
      <div className="mt-3 flex items-baseline gap-3 rounded-lg bg-slate-50 p-3">
        <span className="text-lg font-extrabold text-slate-900">{formatSAR(d.bundlePrice)}</span>
        <span className="text-sm text-slate-400 line-through">{formatSAR(d.originalPrice ?? 0)}</span>
        <span className="text-xs text-slate-500">
          سعر مقترح{d.occasion ? ` · ${d.occasion}` : ""}
        </span>
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
