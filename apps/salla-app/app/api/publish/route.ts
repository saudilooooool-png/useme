import { NextResponse } from "next/server";
import { getPlatform, type PlatformId } from "@distrios/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * ينشر التوصيات المعتمدة إلى المتجر.
 *
 * في النسخة الحقيقية يُستدعى موصّل زد/سلة (OAuth) لتطبيق الحزم والخصومات
 * والتعديلات على المنتجات. حاليًا محاكاة تُعيد ملخّص النشر.
 */
export async function POST(req: Request) {
  const { platform, ids } = (await req.json()) as {
    platform: PlatformId;
    ids: string[];
  };
  const p = getPlatform(platform);
  return NextResponse.json({
    published: ids.length,
    ids,
    platform: p.nameAr,
    simulated: true,
  });
}
