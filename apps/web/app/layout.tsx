import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "DistriOS — أتمتة المبيعات للموزّعين على زد وسلة",
  description:
    "نظام تجارة إلكترونية شامل للموزّعين والمستوردين: معالجة البيانات بالذكاء الاصطناعي، النشر على زد وسلة، الطلبات المركزية، والحزم الذكية.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
