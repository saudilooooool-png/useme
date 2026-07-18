"use client";

import { useLang } from "./LanguageProvider";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-center md:flex-row md:text-start">
        <div>
          <div className="flex items-center justify-center gap-2 font-extrabold text-ink md:justify-start">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">D</span>
            DistriOS
          </div>
          <p className="mt-2 max-w-sm text-sm text-ink-muted">{t.footer.tagline}</p>
        </div>
        <p className="text-sm text-ink-muted">
          © 2026 DistriOS. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
