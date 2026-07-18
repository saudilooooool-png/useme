// الأنواع الأساسية المشتركة بين تطبيقَي زد وسلة والمحرك المركزي.

/** منصات البيع المدعومة. */
export type PlatformId = "zid" | "salla";

/** صف منتج خام كما يصل من ملف Excel/CSV أو نظام ERP. */
export interface RawProduct {
  sku: string;
  /** الاسم الخام كما ورد في الملف (غالبًا غير منظّم). */
  rawName: string;
  /** تكلفة الشراء بالريال. */
  cost: number;
  /** الكمية المتاحة في المستودع. */
  stock: number;
  /** حقول إضافية غير منظّمة (لون، حجم، علامة تجارية...). */
  extra?: Record<string, string | number>;
}

/** منتج بعد المعالجة والتحسين بالذكاء الاصطناعي. */
export interface EnrichedProduct {
  sku: string;
  /** عنوان محسّن لمحركات البحث (SEO). */
  title: string;
  /** وصف تسويقي جاهز للنشر. */
  description: string;
  /** التصنيف المقترح. */
  category: string;
  /** سمات المنتج المستخرجة (لون، مقاس، مادة...). */
  attributes: Record<string, string>;
  /** كلمات مفتاحية للبحث. */
  keywords: string[];
  cost: number;
  stock: number;
  /** درجة جودة البيانات 0-100. */
  qualityScore: number;
}

/** هيكل رسوم المنصة المستخدم في حساب السعر. */
export interface PlatformFees {
  /** نسبة عمولة المنصة (0.08 = 8%). */
  commissionRate: number;
  /** رسوم ثابتة لكل طلب بالريال. */
  fixedFee: number;
  /** نسبة رسوم بوابة الدفع. */
  paymentRate: number;
  /** ضريبة القيمة المضافة (0.15 في السعودية). */
  vatRate: number;
}

/** نتيجة حساب التسعير المثلى. */
export interface PriceQuote {
  sku: string;
  platform: PlatformId;
  cost: number;
  /** هامش الربح المستهدف (0.3 = 30%). */
  targetMargin: number;
  /** السعر النهائي المعروض للعميل (شامل الضريبة). */
  sellingPrice: number;
  /** صافي الربح للتاجر بعد كل الرسوم. */
  netProfit: number;
  /** تفصيل الرسوم المخصومة. */
  breakdown: {
    commission: number;
    fixedFee: number;
    payment: number;
    vat: number;
  };
}

export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

/** طلب موحّد قادم من إحدى المنصات إلى اللوحة المركزية. */
export interface Order {
  id: string;
  platform: PlatformId;
  customerName: string;
  city: string;
  items: { sku: string; title: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  /** رقم بوليصة الشحن (Air Waybill). */
  awb?: string;
  /** رقم الفاتورة المتوافقة مع "فاتورة" (ZATCA). */
  invoiceId?: string;
  createdAt: string;
}

/** حزمة منتجات مُنشأة تلقائيًا. */
export interface Bundle {
  id: string;
  title: string;
  skus: string[];
  /** نوع الحزمة: سلوكية (تُشترى معًا) أو استعادة مخزون راكد. */
  kind: "behavioral" | "blocked-stock";
  /** السعر الأصلي المجمّع. */
  originalPrice: number;
  /** سعر الحزمة بعد الخصم. */
  bundlePrice: number;
  /** نسبة التحويل المتوقعة. */
  expectedConversion: number;
  reason: string;
}
