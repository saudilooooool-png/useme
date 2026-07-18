import Anthropic from "@anthropic-ai/sdk";
import { enrichBatch } from "../ai-processing";
import type { EnrichedProduct, RawProduct } from "../types";

/**
 * إثراء المنتجات باستخدام نموذج Claude الحقيقي (خادمي فقط).
 *
 * يستدعي هذا الملف واجهة Anthropic ويجب استخدامه من مسارات API الخادمية فقط
 * (لا يُستورد في مكوّنات العميل حتى لا تدخل مكتبة SDK في حزمة المتصفح).
 *
 * إذا لم يتوفّر مفتاح `ANTHROPIC_API_KEY`، أو فشل الاستدعاء، يرجع تلقائيًا إلى
 * المحرك القائم على القواعد (`enrichBatch`) دون أي انقطاع في التجربة.
 */

export interface EnrichResult {
  products: EnrichedProduct[];
  /** true إذا تمّت المعالجة بنموذج Claude فعليًا، false إذا استُخدم المحرك الاحتياطي. */
  aiPowered: boolean;
}

const MODEL = "claude-opus-4-8";

const SYSTEM_PROMPT = `أنت محرّك إثراء منتجات للتجارة الإلكترونية في السوق السعودي (منصتا زد وسلة).
لكل منتج خام تُعطى له، أنشئ:
- title: عنوان عربي محسّن لمحركات البحث (SEO) جذّاب وواضح.
- description: وصف تسويقي عربي من جملتين إلى ثلاث، يبرز الفائدة ويحث على الشراء.
- category: التصنيف الأنسب بالعربية.
- attributes: مصفوفة من {key, value} للسمات المستخرجة (اللون، المقاس، الحجم، العلامة...).
- keywords: مصفوفة من 4 إلى 8 كلمات مفتاحية عربية للبحث.
- qualityScore: رقم 0-100 يقدّر جودة واكتمال بيانات المنتج.
أعِد النتيجة ككائن JSON فقط بالشكل: {"products":[{"sku","title","description","category","attributes":[{"key","value"}],"keywords":[],"qualityScore"}]}
لا تُضِف أي نص خارج JSON.`;

export async function enrichWithClaude(rows: RawProduct[]): Promise<EnrichResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { products: enrichBatch(rows), aiPowered: false };
  }

  try {
    const client = new Anthropic({ apiKey });
    const userPayload = rows.map((r) => ({
      sku: r.sku,
      name: r.rawName,
      cost: r.cost,
      stock: r.stock,
      extra: r.extra ?? {},
    }));

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `عالج هذه المنتجات الخام وأعد JSON فقط:\n${JSON.stringify(userPayload, null, 2)}`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const products = parseModelOutput(text, rows);
    return { products, aiPowered: true };
  } catch {
    // أي فشل (شبكة، مفتاح غير صالح، تنسيق) → المحرك الاحتياطي.
    return { products: enrichBatch(rows), aiPowered: false };
  }
}

interface ModelProduct {
  sku: string;
  title: string;
  description: string;
  category: string;
  attributes?: { key: string; value: string }[];
  keywords?: string[];
  qualityScore?: number;
}

function parseModelOutput(text: string, rows: RawProduct[]): EnrichedProduct[] {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) return enrichBatch(rows);

  const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as {
    products?: ModelProduct[];
  };
  const list = parsed.products ?? [];
  const byId = new Map(rows.map((r) => [r.sku, r]));
  const fallback = new Map(enrichBatch(rows).map((p) => [p.sku, p]));

  return list.map((p) => {
    const raw = byId.get(p.sku);
    const attributes: Record<string, string> = {};
    for (const a of p.attributes ?? []) {
      if (a?.key) attributes[a.key] = String(a.value ?? "");
    }
    return {
      sku: p.sku,
      title: p.title ?? fallback.get(p.sku)?.title ?? p.sku,
      description: p.description ?? "",
      category: p.category ?? "منتجات عامة",
      attributes,
      keywords: p.keywords ?? [],
      cost: raw?.cost ?? 0,
      stock: raw?.stock ?? 0,
      qualityScore:
        typeof p.qualityScore === "number"
          ? Math.max(0, Math.min(100, p.qualityScore))
          : (fallback.get(p.sku)?.qualityScore ?? 70),
    };
  });
}
