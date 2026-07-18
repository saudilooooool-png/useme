import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DistriOS · تطبيق سلة",
  description: "لوحة تحكم تاجر سلة — معالجة البيانات بالذكاء الاصطناعي، التسعير، الطلبات، والحزم الذكية.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
