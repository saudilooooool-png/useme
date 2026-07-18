import type { EnrichedProduct, Order, PriceQuote } from "@distrios/core";
import type { ConnectorConfig, OAuthToken, PlatformConnector } from "./types";

/**
 * موصّل منصة زد (هيكل أولي).
 *
 * التنفيذ الحقيقي يستخدم بوابة شركاء زد:
 *   - OAuth 2.0:  https://oauth.zid.sa/oauth/authorize | /token
 *   - Products:   POST /v1/products
 *   - Orders:     GET  /v1/managers/store/orders
 *
 * حاليًا التوابع ترمي خطأً واضحًا حتى تُزوَّد بمفاتيح شريك حقيقية.
 */
export class ZidConnector implements PlatformConnector {
  readonly id = "zid" as const;

  constructor(private config: ConnectorConfig) {}

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      state,
    });
    return `https://oauth.zid.sa/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode(_code: string): Promise<OAuthToken> {
    throw new Error("ZidConnector.exchangeCode: يتطلب مفاتيح شريك زد الحقيقية (غير مُفعّل بعد).");
  }

  async publishProduct(_product: EnrichedProduct, _price: PriceQuote): Promise<{ externalId: string }> {
    throw new Error("ZidConnector.publishProduct: غير مُفعّل بعد — بانتظار ربط API زد.");
  }

  async updateStock(_externalId: string, _stock: number): Promise<void> {
    throw new Error("ZidConnector.updateStock: غير مُفعّل بعد — بانتظار ربط API زد.");
  }

  async fetchOrders(_since?: string): Promise<Order[]> {
    throw new Error("ZidConnector.fetchOrders: غير مُفعّل بعد — بانتظار ربط API زد.");
  }
}
