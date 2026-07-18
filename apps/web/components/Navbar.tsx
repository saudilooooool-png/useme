"use client";

import { useLang } from "./LanguageProvider";

export function Navbar() {
  const { t, lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2 font-extrabold text-lg text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">D</span>
          DistriOS
        </a>

        <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
          <a href="#features" className="hover:text-brand-600">{t.nav.features}</a>
          <a href="#how" className="hover:text-brand-600">{t.nav.how}</a>
          <a href="#case" className="hover:text-brand-600">{t.nav.caseStudy}</a>
          <a href="#pricing" className="hover:text-brand-600">{t.nav.pricing}</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-ink-soft hover:border-brand-300"
          >
            {lang === "ar" ? "EN" : "ع"}
          </button>
          <a
            href="#cta"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
