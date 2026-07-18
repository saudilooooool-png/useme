import Anthropic from "@anthropic-ai/sdk";
import { enrichBatch } from "../ai-processing";
import { generateRecommendations, type Recommendation } from "../recommendations";
import { mockOrders, RAW_PRODUCTS } from "../mock-data";
import type { PlatformId } from "../types";

/**
 * يولّد توصيات المتجر، ثم يستخدم Claude لتحسين صياغة «السبب» و«الأثر» بالعربية
 * وترتيب الأولوية. خادمي فقط، مع رجوع تلقائي للتوصيات القائمة على القواعد عند
 * غياب `ANTHROPIC_API_KEY` أو أي فشل.
 */

export interface RecommendResult {
  recommendations: Recommendation[];
  aiPowered: boolean;
}

const MODEL = "claude-opus-4-8";

const SYSTEM_PROMPT = `أنت مستشار تجارة إلكترونية للسوق السعودي. تُعطى توصيات مبدئية لمتجر (زد/سلة).
حسّن لكل توصية حقلي "rationale" (السبب المبني على البيانات) و"impact" (الأثر المتوقّع)
بصياغة عربية مقنعة وموجزة موجّهة لصاحب المتجر، وأعد ترتيب "confidence" (0-1) بواقعية.
لا تغيّر id أو type أو detail. أعِد JSON فقط بالشكل:
{"recommendations":[{"id","rationale","impact","confidence"}]}`;

export async function recommendWithClaude(platform: PlatformId): Promise<RecommendResult> {
  const products = enrichBatch(RAW_PRODUCTS);
  const orders = mockOrders(platform);
  const base = generateRecommendations(RAW_PRODUCTS, products, orders, platform, {
    month: new Date().getMonth(),
  });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { recommendations: base, aiPowered: false };

  try {
    const client = new Anthropic({ apiKey });
    const payload = base.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      rationale: r.rationale,
      impact: r.impact,
    }));

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `حسّن هذه التوصيات لمتجر على منصة ${platform}. أعد JSON فقط:\n${JSON.stringify(payload, null, 2)}`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const merged = mergeEnhancements(base, text);
    return { recommendations: merged, aiPowered: true };
  } catch {
    return { recommendations: base, aiPowered: false };
  }
}

function mergeEnhancements(base: Recommendation[], text: string): Recommendation[] {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return base;

  const parsed = JSON.parse(text.slice(start, end + 1)) as {
    recommendations?: { id: string; rationale?: string; impact?: string; confidence?: number }[];
  };
  const byId = new Map((parsed.recommendations ?? []).map((r) => [r.id, r]));

  return base.map((r) => {
    const e = byId.get(r.id);
    if (!e) return r;
    return {
      ...r,
      rationale: e.rationale ?? r.rationale,
      impact: e.impact ?? r.impact,
      confidence:
        typeof e.confidence === "number" ? Math.max(0, Math.min(1, e.confidence)) : r.confidence,
    };
  });
}
