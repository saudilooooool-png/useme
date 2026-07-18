"use client";

import { useState } from "react";
import type { Recommendation } from "@distrios/core";
import { formatSAR } from "@distrios/ui";
import { usePlatform } from "../PlatformContext";
import { useReco } from "../RecommendationsContext";

export function PreviewScreen() {
  const platform = usePlatform();
  const { approved } = useReco();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<number | null>(null);

  const offers = approved.filter(
    (r) => r.type === "bundle" || r.type === "cross_sell" || r.type === "seasonal" || r.type === "category"
  );
  const changes = approved.filter(
    (r) => r.type === "edit" || r.type === "price" || r.type === "restock"
  );

  async function publish() {
    setPublishing(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platform.id, ids: approved.map((r) => r.id) }),
      });
      const data = (await res.json()) as { published: number };
      setPublished(data.published);
    } finally {
      setPublishing(false);
    }
  }

  if (approved.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        لا توجد توصيات معتمدة بعد. اعتمد بعض التوصيات من تبويب «التوصيات» لتظهر هنا معاينة الصفحة
        المقترحة قبل نشرها إلى متجرك.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-5">
        <div>
          <h3 className="font-bold text-slate-900">معاينة قبل النشر النهائي</h3>
          <p className="text-sm text-slate-500">
            هكذا ستظهر العروض المعتمدة لعملائك على {platform.nameAr}. راجعها ثم انشرها إلى المتجر.
          </p>
        </div>
        <button
          onClick={publish}
          disabled={publishing}
          className="rounded-lg px-5 py-2.5 font-bold text-white hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: platform.brandColor }}
        >
          {publishing ? "جارٍ النشر…" : `نشر ${approved.length} إلى ${platform.nameAr}`}
        </button>
      </div>

      {published !== null && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          ✅ تم نشر {published} توصية إلى متجرك على {platform.nameAr} (وضع محاكاة — يُربط بموصّل
          {" "}{platform.nameAr} الحقيقي عند تفعيله).
        </div>
      )}

      {/* معاينة العروض بشكل صفحة عميل */}
      {offers.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-400">العروض المقترحة (كما يراها العميل)</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map((r) => (
              <OfferPreview key={r.id} r={r} />
            ))}
          </div>
        </div>
      )}

      {/* تعديلات ستُطبّق على المنتجات */}
      {changes.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-400">تعديلات ستُطبّق على المنتجات</h4>
          <div className="space-y-2">
            {changes.map((r) => (
              <div key={r.id} className="rounded-lg border border-slate-100 bg-white px-4 py-3 text-sm text-slate-700">
                {r.title}
                {r.detail.proposedPrice != null && (
                  <span className="ms-2 text-emerald-600">→ {formatSAR(r.detail.proposedPrice)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OfferPreview({ r }: { r: Recommendation }) {
  const d = r.detail;
  const isCross = r.type === "cross_sell";
  const price = isCross ? d.proposedPrice : d.bundlePrice;
  const was = isCross ? d.currentPrice : d.originalPrice;
  const badge =
    r.type === "seasonal"
      ? `عرض ${d.occasion ?? "موسمي"} 🗓`
      : r.type === "category"
      ? "حزمة فئة 🏷"
      : isCross
      ? `اشترِ + وفّر ${d.discountPct}% ⇄`
      : "عرض حزمة 🎁";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-1 bg-slate-100 p-4">
        {d.productTitles.map((t) => (
          <div key={t} className="grid h-20 place-items-center rounded-lg bg-white p-2 text-center text-xs text-slate-500">
            {t}
          </div>
        ))}
      </div>
      <div className="p-4">
        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
          {badge}
        </span>
        <h5 className="mt-2 font-bold text-slate-900">
          {isCross
            ? `${d.triggerTitle} + ${d.targetTitle} بسعر خاص`
            : d.productTitles.join(" + ")}
        </h5>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-slate-900">{formatSAR(price ?? 0)}</span>
          {was != null && <span className="text-sm text-slate-400 line-through">{formatSAR(was)}</span>}
        </div>
        <button className="mt-3 w-full rounded-lg bg-slate-900 py-2 text-sm font-bold text-white">
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
}
