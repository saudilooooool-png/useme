"use client";

import { useLang } from "./LanguageProvider";
import { IconCheck } from "./Icons";

export function RecoTypes() {
  const { t } = useLang();
  return (
    <section id="reco" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-ink md:text-4xl">{t.recoTypes.heading}</h2>
          <p className="mt-4 text-lg text-ink-soft">{t.recoTypes.sub}</p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.recoTypes.types.map((ty) => (
            <div key={ty.name} className="rounded-2xl border border-slate-100 bg-white p-6">
              <div className="text-2xl">{ty.icon}</div>
              <h3 className="mt-3 font-bold text-ink">{ty.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{ty.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 md:p-10">
          <h3 className="text-2xl font-bold text-ink">{t.recoTypes.dashboardTitle}</h3>
          <p className="mt-2 text-ink-soft">{t.recoTypes.dashboardDesc}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {t.recoTypes.dashboardPoints.map((p) => (
              <li key={p} className="flex items-start gap-2 text-ink-soft">
                <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
