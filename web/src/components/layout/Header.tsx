"use client";

import { usePathname } from "next/navigation";
import { CalendarRange, Building2, Filter, Download } from "lucide-react";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "داشبورد مدیریتی",
    subtitle: "نمای سازمانی پرونده‌ها، شکایات، عملکرد و پوشش دانش تاریخی",
  },
  "/analytics/requests": {
    title: "تحلیل درخواست‌ها و شکایات",
    subtitle: "حجم، SubjectClass، کانال، استان و نامزدهای تکرار (نمایشی)",
  },
  "/analytics/categories": {
    title: "کاوش دسته‌بندی",
    subtitle: "درخت Zone → Nature → Group → Subject بر اساس ابعاد دیده‌بان (نمایشی)",
  },
  "/analytics/topics": {
    title: "کاوش موضوع و خوشه",
    subtitle: "خوشه‌های NLP نمایشی، کلیدواژه، تحول زمانی و گراف روابط معنادار",
  },
  "/knowledge/coverage": {
    title: "هوش پاسخ تاریخی",
    subtitle: "پوشش پاسخ موجود در برابر اعتبار قانونی — بدون ادعای ۷۰٪ تأییدنشده",
  },
  "/performance/kpi": {
    title: "پایش شاخص‌ها",
    subtitle: "کاتالوگ KPI با تعریف، فرمول، فیلدها و وضعیت امکان‌سنجی دیده‌بان",
  },
  "/reports/standard": {
    title: "گزارش‌های استاندارد",
    subtitle: "کاتالوگ گزارش‌های سازمانی با خروجی PDF/Excel نمایشی",
  },
  "/reports/export": {
    title: "مرکز خروجی",
    subtitle: "صف jobهای خروجی و وضعیت دانلودهای نمایشی",
  },
  "/ai/performance": {
    title: "عملکرد مدل‌های هوش مصنوعی",
    subtitle: "پوسته پایش — بدون ادعای دقت عملیاتی تا ارزیابی واقعی",
  },
  "/admin/users": {
    title: "کاربران و نقش‌ها",
    subtitle: "پوسته Identity — مدیریت واقعی در فاز بعدی",
  },
  "/admin/sources": {
    title: "منابع داده",
    subtitle: "وضعیت دیده‌بان و منابع تحلیلی برنامه‌ریزی‌شده",
  },
  "/admin/integration": {
    title: "پایش یکپارچه‌سازی",
    subtitle: "سلامت اتصال، Provider و جاب‌های تجمیع",
  },
  "/admin/audit": {
    title: "لاگ ممیزی",
    subtitle: "رویدادهای دسترسی و خروجی — نمونه نمایشی",
  },
  "/admin/settings": {
    title: "تنظیمات سامانه",
    subtitle: "زبان، Provider، ماسک PII — ذخیره هنوز فعال نیست",
  },
};

export function Header() {
  const pathname = usePathname();
  const meta = titles[pathname] ?? {
    title: "پلتفرم هوش تحلیلی",
    subtitle: "نسخه اولیه Outside-In",
  };

  return (
    <header className="border-b border-[var(--border)] bg-white/90 px-5 py-4 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{meta.title}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{meta.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-700">
            <CalendarRange className="h-4 w-4 text-[var(--brand)]" />
            <select className="bg-transparent outline-none" defaultValue="30d" aria-label="بازه زمانی">
              <option value="30d">۳۰ روز اخیر</option>
              <option value="90d">۹۰ روز اخیر</option>
              <option value="ytd">از ابتدای سال</option>
              <option value="all">کل دوره تاریخی</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-700">
            <Building2 className="h-4 w-4 text-[var(--brand)]" />
            <select className="bg-transparent outline-none" defaultValue="all" aria-label="واحد سازمانی">
              <option value="all">همه واحدها</option>
              <option value="tehran">بهزیستی تهران</option>
              <option value="isfahan">بهزیستی اصفهان</option>
              <option value="khorasan">بهزیستی خراسان رضوی</option>
              <option value="fars">بهزیستی فارس</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-700">
            <Filter className="h-4 w-4 text-[var(--brand)]" />
            <select className="bg-transparent outline-none" defaultValue="all" aria-label="طبقه درخواست">
              <option value="all">همه طبقات</option>
              <option value="complaint">شکایت</option>
              <option value="guidance">راهنمایی و ارشاد</option>
              <option value="report">گزارش</option>
              <option value="suggestion">پیشنهاد</option>
            </select>
          </label>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-strong)]"
          >
            <Download className="h-4 w-4" />
            خروجی گزارش
          </button>
        </div>
      </div>
    </header>
  );
}
