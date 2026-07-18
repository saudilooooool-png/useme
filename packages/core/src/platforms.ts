import type { PlatformFees, PlatformId } from "./types";

export interface PlatformProfile {
  id: PlatformId;
  /** الاسم بالعربية. */
  nameAr: string;
  nameEn: string;
  /** اللون الأساسي للعلامة التجارية. */
  brandColor: string;
  fees: PlatformFees;
  /** شركات الشحن المتاحة لتوليد بوليصة الشحن (AWB). */
  couriers: string[];
}

/**
 * ملفات تعريف المنصتين. القيم تقريبية لأغراض العرض،
 * وتُستبدل بالقيم الرسمية عند الربط الحقيقي بالـ APIs.
 */
export const PLATFORMS: Record<PlatformId, PlatformProfile> = {
  zid: {
    id: "zid",
    nameAr: "زد",
    nameEn: "Zid",
    brandColor: "#5D3FD3",
    fees: {
      commissionRate: 0.05,
      fixedFee: 2,
      paymentRate: 0.025,
      vatRate: 0.15,
    },
    couriers: ["أرامكس", "سمسا", "سبل", "iMile"],
  },
  salla: {
    id: "salla",
    nameAr: "سلة",
    nameEn: "Salla",
    brandColor: "#00B48D",
    fees: {
      commissionRate: 0.04,
      fixedFee: 1.5,
      paymentRate: 0.025,
      vatRate: 0.15,
    },
    couriers: ["أرامكس", "سمسا", "ريدبوكس", "iMile"],
  },
};

export function getPlatform(id: PlatformId): PlatformProfile {
  return PLATFORMS[id];
}
