import { NextResponse } from "next/server";
import { fulfillOrder, mockOrders, type PlatformId } from "@distrios/core";
import { sendWhatsApp, type WhatsAppEvent } from "@distrios/core/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** يرسل إشعار واتساب لطلب معيّن (أو محاكاة إن لم تُضبط بيانات الاعتماد). */
export async function POST(req: Request) {
  const { orderId, platform, event } = (await req.json()) as {
    orderId: string;
    platform: PlatformId;
    event: WhatsAppEvent;
  };
  const orders = mockOrders(platform);
  const idx = orders.findIndex((o) => o.id === orderId);
  const order = fulfillOrder(orders[idx >= 0 ? idx : 0], (idx >= 0 ? idx : 0) + 1);
  const result = await sendWhatsApp(event, order);
  return NextResponse.json(result);
}
