import type { EnrichedProduct, RawProduct } from "./types";

/**
 * محرك معالجة البيانات وتحسينها.
 *
 * في هذه النسخة الأولى، المنطق قائم على قواعد حتمية (rule-based) يحاكي
 * سلوك نموذج الذكاء الاصطناعي: تنظيف الاسم، استخراج السمات، توليد عنوان
 * ووصف محسّنين لمحركات البحث. عند الربط الحقيقي يُستبدل هذا الملف
 * باستدعاء نموذج لغوي (LLM) مع الحفاظ على نفس التوقيع (signature).
 */

const CATEGORY_HINTS: { keywords: string[]; category: string }[] = [
  { keywords: ["جوال", "هاتف", "phone", "iphone", "سماعة", "شاحن"], category: "إلكترونيات" },
  { keywords: ["قميص", "فستان", "حذاء", "عباية", "shirt", "dress"], category: "أزياء" },
  { keywords: ["كريم", "عطر", "مكياج", "perfume", "cream"], category: "العناية والجمال" },
  { keywords: ["قهوة", "تمر", "عسل", "coffee", "شاي"], category: "أطعمة ومشروبات" },
  { keywords: ["كرسي", "طاولة", "مصباح", "سجاد"], category: "أثاث ومنزل" },
];

const STOPWORDS = new Set(["the", "a", "new", "جديد", "-", "|", "×"]);

function cleanName(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/[_]+/g, " ")
    .split(" ")
    .filter((w) => w && !STOPWORDS.has(w.toLowerCase()))
    .join(" ")
    .trim();
}

function guessCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const hint of CATEGORY_HINTS) {
    if (hint.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return hint.category;
    }
  }
  return "منتجات عامة";
}

function extractAttributes(raw: RawProduct): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (raw.extra) {
    for (const [key, value] of Object.entries(raw.extra)) {
      if (value !== undefined && value !== "") attrs[key] = String(value);
    }
  }
  // استخراج بعض السمات الشائعة من الاسم الخام.
  const colorMatch = raw.rawName.match(/(أحمر|أزرق|أخضر|أسود|أبيض|ذهبي|فضي)/);
  if (colorMatch && !attrs["اللون"]) attrs["اللون"] = colorMatch[1];
  const sizeMatch = raw.rawName.match(/\b(XS|S|M|L|XL|XXL|\d+\s?(GB|مل|جم))\b/i);
  if (sizeMatch && !attrs["المقاس"]) attrs["المقاس"] = sizeMatch[1];
  return attrs;
}

function buildKeywords(name: string, category: string): string[] {
  const words = name.split(" ").filter((w) => w.length > 2);
  return Array.from(new Set([...words, category, "توصيل سريع", "أفضل سعر"])).slice(0, 8);
}

function scoreQuality(raw: RawProduct, attrs: Record<string, string>): number {
  let score = 40;
  if (raw.rawName.length > 10) score += 20;
  if (raw.cost > 0) score += 15;
  if (raw.stock > 0) score += 10;
  score += Math.min(15, Object.keys(attrs).length * 5);
  return Math.min(100, score);
}

/** يحوّل صفًا خامًا واحدًا إلى منتج محسّن جاهز للنشر. */
export function enrichProduct(raw: RawProduct): EnrichedProduct {
  const name = cleanName(raw.rawName);
  const category = guessCategory(name);
  const attributes = extractAttributes(raw);
  const attrText = Object.entries(attributes)
    .map(([k, v]) => `${k}: ${v}`)
    .join("، ");

  const title = `${name} — ${category} | شحن سريع لكل مدن المملكة`;
  const description =
    `اكتشف ${name} من فئة ${category}. ` +
    (attrText ? `المواصفات: ${attrText}. ` : "") +
    `منتج أصلي بجودة عالية وسعر تنافسي، مع توصيل سريع وضمان استرجاع. ` +
    `اطلب الآن قبل نفاد الكمية.`;

  return {
    sku: raw.sku,
    title,
    description,
    category,
    attributes,
    keywords: buildKeywords(name, category),
    cost: raw.cost,
    stock: raw.stock,
    qualityScore: scoreQuality(raw, attributes),
  };
}

/** يعالج دفعة كاملة من المنتجات الخام. */
export function enrichBatch(rows: RawProduct[]): EnrichedProduct[] {
  return rows.map(enrichProduct);
}
