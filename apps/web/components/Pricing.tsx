"use client";

import { useLang } from "./LanguageProvider";
import { IconCheck } from "./Icons";

export function Pricing() {
  const { t } = useLang();
  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-ink md:text-4xl">{t.pricing.heading}</h2>
          <p className="mt-4 text-lg text-ink-soft">{t.pricing.sub}</p>
        </div>

        <div className="mt-14 grid items-start gap-6 md:grid-cols-3">
          {t.pricing.plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-white p-7 ${
                plan.popular ? "border-brand-500 shadow-soft md:-mt-4 md:mb-4" : "border-slate-100"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                  {plan.cta}
                </span>
              )}
              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-ink">{plan.price}</span>
                <span className="text-ink-muted">{plan.period}</span>
              </div>
              <span className="mt-1 block text-xs text-ink-muted">
                {plan.period ? "ريال · SAR" : ""}
              </span>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`mt-7 block rounded-xl px-5 py-3 text-center font-bold ${
                  plan.popular
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-slate-200 text-ink hover:border-brand-300"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
