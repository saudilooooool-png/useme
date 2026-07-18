"use client";

import { useLang } from "./LanguageProvider";

export function CaseStudy() {
  const { t } = useLang();
  return (
    <section id="case" className="mx-auto max-w-6xl px-5 py-24">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-brand-700 to-brand-500 p-10 text-white md:p-14">
        <span className="text-sm font-semibold uppercase tracking-wider text-brand-100">
          {t.caseStudy.heading}
        </span>
        <blockquote className="mt-6 max-w-3xl text-2xl font-bold leading-relaxed md:text-3xl">
          “{t.caseStudy.quote}”
        </blockquote>
        <p className="mt-5 text-brand-100">— {t.caseStudy.author}</p>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/20 pt-8 sm:grid-cols-3">
          {t.caseStudy.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-4xl font-extrabold">{m.value}</div>
              <div className="mt-1 text-brand-100">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
