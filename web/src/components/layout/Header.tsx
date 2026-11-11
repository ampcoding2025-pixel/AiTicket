"use client";

import { usePathname } from "next/navigation";
import { CalendarRange, Building2, Filter, Download } from "lucide-react";
import { useDashboardFilters } from "@/data/DashboardFilterContext";
import { SUBJECT_CLASS_OPTIONS, type PeriodKey } from "@/data/filters";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "داشبورد مدیریتی",
    subtitle: "نمای مدیریتی حجم پرونده و پوشش دانش — برای تصمیم‌گیری سطح سازمان",
  },
  "/analytics/requests": {
    title: "تحلیل درخواست‌ها و شکایات",
    subtitle: "حجم، SubjectClass، کانال، استان و نامزدهای تکرار",
  },
  "/analytics/categories": {
    title: "کاوش دسته‌بندی",
    subtitle: "درخت Zone → Nature → Group → Subject بر اساس ابعاد دیده‌بان",
  },
  "/analytics/topics": {
    title: "کاوش موضوع و خوشه",
    subtitle: "پایه تاکسونومی Subject (نه NLP) + تحول زمانی",
  },
  "/knowledge/answers": {
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
  const { filters, setPeriod, setSubjectClassId } = useDashboardFilters();
  const meta = titles[pathname] ?? {
    title: "پلتفرم هوش تحلیلی",
    subtitle: "نسخه اولیه Outside-In",
  };

  const classValue =
    SUBJECT_CLASS_OPTIONS.find((o) => o.id === filters.subjectClassId)?.value ?? "all";

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
            <select
              className="bg-transparent outline-none"
              value={filters.period}
              aria-label="بازه زمانی"
              onChange={(e) => setPeriod(e.target.value as PeriodKey)}
            >
              <option value="all">کل دوره تاریخی</option>
              <option value="30d">۳۰ روز اخیر</option>
              <option value="90d">۹۰ روز اخیر</option>
              <option value="ytd">از ابتدای سال</option>
            </select>
          </label>

          <label
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-400"
            title="فیلتر واحد سازمانی پس از فهرست شناسه Department از API فعال می‌شود"
          >
            <Building2 className="h-4 w-4" />
            <select className="bg-transparent outline-none" disabled defaultValue="all" aria-label="واحد سازمانی">
              <option value="all">همه واحدها (غیرفعال)</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-700">
            <Filter className="h-4 w-4 text-[var(--brand)]" />
            <select
              className="bg-transparent outline-none"
              value={classValue}
              aria-label="طبقه درخواست"
              onChange={(e) => {
                const opt = SUBJECT_CLASS_OPTIONS.find((o) => o.value === e.target.value);
                setSubjectClassId(opt?.id ?? null);
              }}
            >
              {SUBJECT_CLASS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            disabled
            title="خروجی پس از پایدار شدن فیلتر بازه فعال می‌شود"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-slate-300 px-3 py-2 text-sm font-medium text-slate-600"
          >
            <Download className="h-4 w-4" />
            خروجی گزارش
          </button>
        </div>
      </div>
    </header>
  );
}
