"use client";

import { useLang } from "./LanguageProvider";
import { IconCheck } from "./Icons";

export function Spotlight() {
  const { t } = useLang();
  return (
    <section id="spotlight" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-ink md:text-4xl">{t.spotlight.heading}</h2>
        <p className="mt-4 text-lg text-ink-soft">{t.spotlight.sub}</p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {t.spotlight.cards.map((c) => (
          <div
            key={c.title}
            className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
          >
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                c.tag === "WhatsApp"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-brand-50 text-brand-700"
              }`}
            >
              {c.tag === "WhatsApp" ? "💬 WhatsApp" : "✦ AI"}
            </span>
            <h3 className="mt-5 text-2xl font-bold text-ink">{c.title}</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">{c.desc}</p>
            <ul className="mt-6 space-y-3">
              {c.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-ink-soft">
                  <IconCheck
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      c.tag === "WhatsApp" ? "text-emerald-500" : "text-brand-500"
                    }`}
                  />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
