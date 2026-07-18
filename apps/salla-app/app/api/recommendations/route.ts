import { NextResponse } from "next/server";
import type { PlatformId } from "@distrios/core";
import { recommendWithClaude } from "@distrios/core/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** يحلّل بيانات المتجر ويولّد توصيات (مُحسّنة بـ Claude أو المحرك الاحتياطي). */
export async function POST(req: Request) {
  const { platform } = (await req.json()) as { platform: PlatformId };
  const result = await recommendWithClaude(platform);
  return NextResponse.json(result);
}
