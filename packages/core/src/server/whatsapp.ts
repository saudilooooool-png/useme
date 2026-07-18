import type { Order } from "../types";

/**
 * موصّل واتساب (WhatsApp Business Cloud API) — خادمي فقط.
 *
 * يرسل إشعارات للعملاء عبر Graph API. إذا لم تتوفّر متغيّرات البيئة
 * (`WHATSAPP_TOKEN` و`WHATSAPP_PHONE_ID`)، يعمل في وضع محاكاة يُرجع نص
 * الرسالة التي كانت ستُرسَل — مفيد للعرض قبل تفعيل الربط الحقيقي.
 */

export type WhatsAppEvent = "order_confirmed" | "order_shipped" | "invoice";

export interface WhatsAppResult {
  /** true إذا أُرسلت فعليًا عبر واتساب، false إذا كانت محاكاة. */
  sent: boolean;
  /** نص الرسالة (للعرض في اللوحة). */
  message: string;
  /** رقم العميل المستهدف (وهمي في وضع العرض). */
  to: string;
}

/** يبني نص الرسالة العربية المناسبة لنوع الحدث. */
export function buildMessage(event: WhatsAppEvent, order: Order): string {
  switch (event) {
    case "order_confirmed":
      return (
        `مرحبًا ${order.customerName} 👋\n` +
        `تم استلام طلبك رقم ${order.id} بنجاح ✅\n` +
        `الإجمالي: ${order.total} ريال.\n` +
        `سنعلمك فور شحنه. شكرًا لثقتك 🌟`
      );
    case "order_shipped":
      return (
        `أخبار سعيدة ${order.customerName} 🚚\n` +
        `تم شحن طلبك رقم ${order.id}.\n` +
        (order.awb ? `رقم التتبع (AWB): ${order.awb}\n` : "") +
        `يمكنك تتبّع شحنتك حتى وصولها إلى ${order.city}.`
      );
    case "invoice":
      return (
        `فاتورتك جاهزة 🧾\n` +
        `طلب رقم ${order.id}\n` +
        (order.invoiceId ? `رقم الفاتورة (متوافقة مع فاتورة ZATCA): ${order.invoiceId}\n` : "") +
        `الإجمالي: ${order.total} ريال. شكرًا لك.`
      );
  }
}

export async function sendWhatsApp(
  event: WhatsAppEvent,
  order: Order,
  toOverride?: string
): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const to = toOverride ?? "9665XXXXXXXX";
  const message = buildMessage(event, order);

  if (!token || !phoneId) {
    // وضع المحاكاة — لم تُضبط بيانات اعتماد واتساب بعد.
    return { sent: false, message, to };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    );
    return { sent: res.ok, message, to };
  } catch {
    return { sent: false, message, to };
  }
}
