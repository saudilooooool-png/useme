import { clsx, type ClassValue } from "clsx";

/** يدمج أصناف CSS بشكل شرطي. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** ينسّق مبلغًا بالريال السعودي. */
export function formatSAR(amount: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** ينسّق نسبة مئوية. */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
