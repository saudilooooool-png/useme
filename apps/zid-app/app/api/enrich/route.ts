import { NextResponse } from "next/server";
import { RAW_PRODUCTS } from "@distrios/core";
import { enrichWithClaude } from "@distrios/core/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** يعالج المنتجات الخام بالذكاء الاصطناعي (Claude) مع محرك احتياطي. */
export async function POST() {
  const result = await enrichWithClaude(RAW_PRODUCTS);
  return NextResponse.json(result);
}
