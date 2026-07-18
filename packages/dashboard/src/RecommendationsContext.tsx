"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { PlatformId, Recommendation, RecommendationStatus } from "@distrios/core";

interface RecoContextValue {
  recommendations: Recommendation[];
  loading: boolean;
  loaded: boolean;
  aiPowered: boolean | null;
  load: () => Promise<void>;
  setStatus: (id: string, status: RecommendationStatus) => void;
  approved: Recommendation[];
}

const RecoContext = createContext<RecoContextValue | null>(null);

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
      setRecommendations(data.recommendations);
      setAiPowered(data.aiPowered);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [platform]);

  const setStatus = useCallback((id: string, status: RecommendationStatus) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }, []);

  const approved = recommendations.filter((r) => r.status === "approved");

  return (
    <RecoContext.Provider
      value={{ recommendations, loading, loaded, aiPowered, load, setStatus, approved }}
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
