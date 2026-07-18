"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  pastRecommendations,
  type PlatformId,
  type Recommendation,
  type RecommendationStatus,
} from "@distrios/core";

interface RecoContextValue {
  recommendations: Recommendation[];
  history: Recommendation[];
  loading: boolean;
  loaded: boolean;
  aiPowered: boolean | null;
  load: () => Promise<void>;
  setStatus: (id: string, status: RecommendationStatus) => void;
  approved: Recommendation[];
}

const RecoContext = createContext<RecoContextValue | null>(null);

type Decisions = Record<string, RecommendationStatus>;

export function RecommendationsProvider({
  platform,
  children,
}: {
  platform: PlatformId;
  children: React.ReactNode;
}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [aiPowered, setAiPowered] = useState<boolean | null>(null);
  const [decisions, setDecisions] = useState<Decisions>({});

  const storageKey = `distrios:${platform}:decisions`;
  const history = useMemo(() => pastRecommendations(platform), [platform]);

  // تحميل قرارات هذا التاجر المحفوظة (محاكاة حساب لكل عميل).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setDecisions(JSON.parse(saved) as Decisions);
    } catch {
      /* تجاهل */
    }
  }, [storageKey]);

  const persist = useCallback(
    (next: Decisions) => {
      setDecisions(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* تجاهل */
      }
    },
    [storageKey]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const data = (await res.json()) as {
        recommendations: Recommendation[];
        aiPowered: boolean;
      };
      // تطبيق القرارات المحفوظة لهذا التاجر على التوصيات الجديدة.
      setRecommendations(
        data.recommendations.map((r) =>
          decisions[r.id] ? { ...r, status: decisions[r.id] } : r
        )
      );
      setAiPowered(data.aiPowered);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [platform, decisions]);

  const setStatus = useCallback(
    (id: string, status: RecommendationStatus) => {
      setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      persist({ ...decisions, [id]: status });
    },
    [decisions, persist]
  );

  const approved = recommendations.filter((r) => r.status === "approved");

  return (
    <RecoContext.Provider
      value={{ recommendations, history, loading, loaded, aiPowered, load, setStatus, approved }}
    >
      {children}
    </RecoContext.Provider>
  );
}

export function useReco(): RecoContextValue {
  const ctx = useContext(RecoContext);
  if (!ctx) throw new Error("useReco must be used within RecommendationsProvider");
  return ctx;
}
