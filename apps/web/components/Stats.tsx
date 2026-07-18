"use client";

import { useLang } from "./LanguageProvider";

export function Stats() {
  const { t } = useLang();
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-12 md:grid-cols-4">
        {t.stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-extrabold text-brand-600 md:text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-ink-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
