import type { EnrichedProduct, Order, PriceQuote } from "@distrios/core";

/**
 * الواجهة الموحّدة لأي موصّل منصة. تطبيقا زد وسلة يلتزمان بنفس العقد،
 * ما يضمن أن يحصل كلاهما على "نفس المميزات" عبر نفس التوابع.
 */
export interface PlatformConnector {
  readonly id: "zid" | "salla";

  /** يبدأ تدفّق OAuth ويعيد رابط التفويض. */
  getAuthUrl(state: string): string;

  /** يستبدل رمز التفويض بـ access token. */
  exchangeCode(code: string): Promise<OAuthToken>;

  /** ينشر منتجًا محسّنًا مع سعره على المنصة. */
  publishProduct(product: EnrichedProduct, price: PriceQuote): Promise<{ externalId: string }>;

  /** يحدّث المخزون لمنتج منشور. */
  updateStock(externalId: string, stock: number): Promise<void>;

  /** يجلب الطلبات الجديدة من المنصة إلى اللوحة المركزية. */
  fetchOrders(since?: string): Promise<Order[]>;
}

export interface OAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface ConnectorConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}
