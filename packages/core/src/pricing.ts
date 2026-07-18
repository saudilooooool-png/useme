import { getPlatform } from "./platforms";
import type { PlatformId, PriceQuote } from "./types";

export interface PricingInput {
  sku: string;
  cost: number;
  /** هامش الربح المستهدف كنسبة (0.3 = 30%). */
  targetMargin: number;
  platform: PlatformId;
}

/**
 * محرك التسعير الديناميكي.
 *
 * يحسب سعر البيع الأمثل بحيث يحقق التاجر هامش الربح المستهدف بعد خصم
 * كل رسوم المنصة (العمولة، الرسوم الثابتة، بوابة الدفع) وإضافة ضريبة
 * القيمة المضافة. يعمل بالحل الرياضي المباشر بدون تكرار.
 *
 * صافي الربح المستهدف = التكلفة × الهامش.
 * الإيراد قبل الضريبة يجب أن يغطي: التكلفة + الربح + العمولة + الدفع + الرسوم الثابتة.
 */
export function calculatePrice(input: PricingInput): PriceQuote {
  const { fees } = getPlatform(input.platform);
  const desiredProfit = input.cost * input.targetMargin;

  // basePrice = السعر قبل الضريبة. نحلّ المعادلة:
  // basePrice - commissionRate*basePrice - paymentRate*basePrice - fixedFee - cost = desiredProfit
  const variableRate = fees.commissionRate + fees.paymentRate;
  const basePrice =
    (input.cost + desiredProfit + fees.fixedFee) / (1 - variableRate);

  const commission = basePrice * fees.commissionRate;
  const payment = basePrice * fees.paymentRate;
  const vat = basePrice * fees.vatRate;
  const sellingPrice = basePrice + vat;
  const netProfit = basePrice - commission - payment - fees.fixedFee - input.cost;

  return {
    sku: input.sku,
    platform: input.platform,
    cost: input.cost,
    targetMargin: input.targetMargin,
    sellingPrice: round(sellingPrice),
    netProfit: round(netProfit),
    breakdown: {
      commission: round(commission),
      fixedFee: round(fees.fixedFee),
      payment: round(payment),
      vat: round(vat),
    },
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
