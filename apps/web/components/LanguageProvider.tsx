"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CONTENT, type Content, type Lang } from "@/lib/content";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Content;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = CONTENT[lang].dir;
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: CONTENT[lang] }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
