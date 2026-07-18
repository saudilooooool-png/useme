"use client";

import { useLang } from "./LanguageProvider";

export function FinalCta() {
  const { t } = useLang();
  return (
    <section id="cta" className="mx-auto max-w-6xl px-5 py-24">
      <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-soft md:p-16">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-ink md:text-4xl">
          {t.finalCta.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">{t.finalCta.sub}</p>
        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-ink outline-none focus:border-brand-500"
          />
          <button className="rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">
            {t.finalCta.button}
          </button>
        </form>
      </div>
    </section>
  );
}
