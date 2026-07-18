"use client";

import { useState } from "react";
import type { PlatformId } from "@distrios/core";
import { PlatformProvider, usePlatform } from "./PlatformContext";
import { RecommendationsProvider, useReco } from "./RecommendationsContext";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { RecommendationsScreen } from "./screens/RecommendationsScreen";
import { PreviewScreen } from "./screens/PreviewScreen";
import { StoreDataScreen } from "./screens/StoreDataScreen";

type TabId = "analysis" | "recommendations" | "preview" | "store";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "analysis", label: "التحليل", icon: "▦" },
  { id: "recommendations", label: "التوصيات", icon: "✦" },
  { id: "preview", label: "المعاينة قبل النشر", icon: "◈" },
  { id: "store", label: "بيانات المتجر", icon: "▤" },
];

/** نقطة الدخول: كل تطبيق (زد/سلة) يركّب هذا المكوّن مع مُعرّف منصته. */
export function DashboardApp({ platform }: { platform: PlatformId }) {
  return (
    <PlatformProvider platform={platform}>
      <RecommendationsProvider platform={platform}>
        <DashboardShell />
      </RecommendationsProvider>
    </PlatformProvider>
  );
}

function DashboardShell() {
  const platform = usePlatform();
  const { approved, recommendations } = useReco();
  const [tab, setTab] = useState<TabId>("analysis");

  const pendingCount = recommendations.filter((r) => r.status === "pending").length;
  const badge: Partial<Record<TabId, number>> = {
    recommendations: pendingCount || undefined,
    preview: approved.length || undefined,
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="text-white" style={{ backgroundColor: platform.brandColor }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 font-extrabold">
              {platform.nameEn[0]}
            </span>
            <div>
              <div className="font-extrabold leading-tight">DistriOS · {platform.nameAr}</div>
              <div className="text-xs text-white/80">طبقة ذكاء اصطناعي فوق متجرك</div>
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            متصل ✓ · بيانات تجريبية
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
                tab === t.id
                  ? "border-current text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
              style={tab === t.id ? { borderColor: platform.brandColor, color: platform.brandColor } : undefined}
            >
              <span>{t.icon}</span>
              {t.label}
              {badge[t.id] != null && (
                <span className="rounded-full bg-brand-600 px-1.5 text-xs text-white">{badge[t.id]}</span>
              )}
            </button>
          ))}
        </nav>

        {tab === "analysis" && <AnalysisScreen />}
        {tab === "recommendations" && <RecommendationsScreen />}
        {tab === "preview" && <PreviewScreen />}
        {tab === "store" && <StoreDataScreen />}
      </div>
    </div>
  );
}
