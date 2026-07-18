"use client";

import { useLang } from "./LanguageProvider";

export function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-ink md:text-4xl">{t.howSection.heading}</h2>
          <p className="mt-4 text-lg text-ink-soft">{t.howSection.sub}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {t.howSection.steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-slate-100 bg-white p-6">
              <div className="text-4xl font-extrabold text-brand-100">{s.n}</div>
              <h3 className="mt-2 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              {i < t.howSection.steps.length - 1 && (
                <div className="absolute -bottom-3 left-1/2 hidden h-6 w-px bg-brand-200 md:block" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
