import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "پلتفرم هوش تحلیلی سازمانی",
  description:
    "داشبورد سازمانی تحلیل پرونده‌ها و شکایات دیده‌بان — Outside-In / Mock Data",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
