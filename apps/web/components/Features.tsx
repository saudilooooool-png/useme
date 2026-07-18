"use client";

import { useLang } from "./LanguageProvider";
import { FEATURE_ICONS, IconCheck } from "./Icons";

export function Features() {
  const { t } = useLang();
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-ink md:text-4xl">{t.featuresSection.heading}</h2>
        <p className="mt-4 text-lg text-ink-soft">{t.featuresSection.sub}</p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {t.featuresSection.items.map((f) => {
          const Icon = FEATURE_ICONS[f.icon];
          return (
            <div key={f.title} className="card-hover rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                {Icon ? <Icon className="h-6 w-6" /> : null}
              </div>
              <h3 className="mt-5 text-xl font-bold text-ink">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{f.desc}</p>
              <ul className="mt-5 space-y-2">
                {f.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-ink-soft">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
