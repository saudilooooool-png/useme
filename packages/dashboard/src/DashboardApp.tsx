"use client";

import { useState } from "react";
import type { PlatformId } from "@distrios/core";
import { PlatformProvider, usePlatform } from "./PlatformContext";
import { OverviewScreen } from "./screens/OverviewScreen";
import { ProductsScreen } from "./screens/ProductsScreen";
import { PricingScreen } from "./screens/PricingScreen";
import { OrdersScreen } from "./screens/OrdersScreen";
import { BundlesScreen } from "./screens/BundlesScreen";

type TabId = "overview" | "products" | "pricing" | "orders" | "bundles";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "overview", label: "نظرة عامة", icon: "▦" },
  { id: "products", label: "المنتجات والـ AI", icon: "✦" },
  { id: "pricing", label: "التسعير", icon: "﷼" },
  { id: "orders", label: "الطلبات", icon: "▤" },
  { id: "bundles", label: "الحزم الذكية", icon: "◈" },
];

/** نقطة الدخول: كل تطبيق (زد/سلة) يركّب هذا المكوّن مع مُعرّف منصته. */
export function DashboardApp({ platform }: { platform: PlatformId }) {
  return (
    <PlatformProvider platform={platform}>
      <DashboardShell />
    </PlatformProvider>
  );
}

function DashboardShell() {
  const platform = usePlatform();
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header
        className="text-white"
        style={{ backgroundColor: platform.brandColor }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 font-extrabold">
              {platform.nameEn[0]}
            </span>
            <div>
              <div className="font-extrabold leading-tight">DistriOS · {platform.nameAr}</div>
              <div className="text-xs text-white/80">لوحة تحكم التاجر</div>
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            نسخة تجريبية · بيانات وهمية
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-bold transition ${
                tab === t.id
                  ? "border-current text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
              style={tab === t.id ? { borderColor: platform.brandColor, color: platform.brandColor } : undefined}
            >
              <span className="me-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "overview" && <OverviewScreen />}
        {tab === "products" && <ProductsScreen />}
        {tab === "pricing" && <PricingScreen />}
        {tab === "orders" && <OrdersScreen />}
        {tab === "bundles" && <BundlesScreen />}
      </div>
    </div>
  );
}
