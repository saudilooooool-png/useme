"use client";

import { useLang } from "./LanguageProvider";

const PLATFORM_LOGOS = [
  { name: "زد · Zid", color: "#5D3FD3" },
  { name: "سلة · Salla", color: "#00B48D" },
];

export function Hero() {
  const { t } = useLang();
  return (
    <section id="top" className="hero-gradient relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-700">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          {t.hero.badge}
        </span>

        <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-6xl">
          {t.hero.title}{" "}
          <span className="bg-gradient-to-l from-brand-600 to-brand-400 bg-clip-text text-transparent">
            {t.hero.highlight}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {t.hero.subtitle}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#cta" className="rounded-xl bg-brand-600 px-7 py-3.5 font-bold text-white shadow-soft hover:bg-brand-700">
            {t.hero.ctaPrimary}
          </a>
          <a href="#how" className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-bold text-ink hover:border-brand-300">
            {t.hero.ctaSecondary}
          </a>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">{t.hero.platforms}</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PLATFORM_LOGOS.map((p) => (
              <span
                key={p.name}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
            ))}
            <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-ink-muted">
              WooCommerce · ZATCA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
