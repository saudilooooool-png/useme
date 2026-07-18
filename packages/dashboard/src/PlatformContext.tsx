"use client";

import { createContext, useContext } from "react";
import { getPlatform, type PlatformId, type PlatformProfile } from "@distrios/core";

const PlatformContext = createContext<PlatformProfile | null>(null);

export function PlatformProvider({
  platform,
  children,
}: {
  platform: PlatformId;
  children: React.ReactNode;
}) {
  return (
    <PlatformContext.Provider value={getPlatform(platform)}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform(): PlatformProfile {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}
