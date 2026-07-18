import type { EnrichedProduct, Order, PriceQuote } from "@distrios/core";
import type { ConnectorConfig, OAuthToken, PlatformConnector } from "./types";

/**
 * موصّل منصة سلة (هيكل أولي).
 *
 * التنفيذ الحقيقي يستخدم Salla Partners / Merchant API:
 *   - OAuth 2.0:  https://accounts.salla.sa/oauth2/auth | /token
 *   - Products:   POST https://api.salla.dev/admin/v2/products
 *   - Orders:     GET  https://api.salla.dev/admin/v2/orders
 *   - Webhooks:   لاستقبال الطلبات لحظيًا (app.store.authorize, order.created)
 *
 * حاليًا التوابع ترمي خطأً واضحًا حتى تُزوَّد بمفاتيح شريك حقيقية.
 */
export class SallaConnector implements PlatformConnector {
  readonly id = "salla" as const;

  constructor(private config: ConnectorConfig) {}

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: "offline_access",
      state,
    });
    return `https://accounts.salla.sa/oauth2/auth?${params.toString()}`;
  }

  async exchangeCode(_code: string): Promise<OAuthToken> {
    throw new Error("SallaConnector.exchangeCode: يتطلب مفاتيح شريك سلة الحقيقية (غير مُفعّل بعد).");
  }

  async publishProduct(_product: EnrichedProduct, _price: PriceQuote): Promise<{ externalId: string }> {
    throw new Error("SallaConnector.publishProduct: غير مُفعّل بعد — بانتظار ربط API سلة.");
  }

  async updateStock(_externalId: string, _stock: number): Promise<void> {
    throw new Error("SallaConnector.updateStock: غير مُفعّل بعد — بانتظار ربط API سلة.");
  }

  async fetchOrders(_since?: string): Promise<Order[]> {
    throw new Error("SallaConnector.fetchOrders: غير مُفعّل بعد — بانتظار ربط API سلة.");
  }
}
