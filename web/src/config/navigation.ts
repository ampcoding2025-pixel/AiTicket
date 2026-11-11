export type NavMaturity = "active" | "mock" | "planned";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  maturity: NavMaturity;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    id: "overview",
    label: "مرور کلی",
    items: [
      {
        id: "executive",
        label: "داشبورد مدیریتی",
        href: "/",
        maturity: "active",
      },
    ],
  },
  {
    id: "analytics",
    label: "تحلیل‌ها",
    items: [
      { id: "request-analytics", label: "تحلیل درخواست‌ها", href: "/analytics/requests", maturity: "active" },
      { id: "complaint-analytics", label: "تحلیل شکایات", href: "/analytics/complaints", maturity: "planned" },
      { id: "category-analysis", label: "تحلیل دسته‌بندی", href: "/analytics/categories", maturity: "active" },
      { id: "topics", label: "کاوش موضوع و خوشه", href: "/analytics/topics", maturity: "active" },
      { id: "sentiment", label: "تحلیل احساسات", href: "/analytics/sentiment", maturity: "planned" },
      { id: "trends", label: "تحلیل روند", href: "/analytics/trends", maturity: "planned" },
      { id: "geo", label: "تحلیل جغرافیایی / شعب", href: "/analytics/geo", maturity: "planned" },
    ],
  },
  {
    id: "performance",
    label: "عملکرد",
    items: [
      { id: "kpi", label: "پایش شاخص‌ها", href: "/performance/kpi", maturity: "active" },
      { id: "sla", label: "SLA و زمان پاسخ", href: "/performance/sla", maturity: "planned" },
      { id: "org-perf", label: "عملکرد واحد سازمانی", href: "/performance/units", maturity: "planned" },
      { id: "workload", label: "توزیع بار کاری", href: "/performance/workload", maturity: "planned" },
    ],
  },
  {
    id: "knowledge",
    label: "هوش دانش",
    items: [
      { id: "answer-coverage", label: "پوشش پاسخ تاریخی", href: "/knowledge/answers", maturity: "active" },
      { id: "similar", label: "کاوش موارد مشابه", href: "/knowledge/similar", maturity: "planned" },
      { id: "kb", label: "پایگاه دانش", href: "/knowledge/base", maturity: "planned" },
      { id: "regs", label: "مدیریت بخشنامه‌ها", href: "/knowledge/regulations", maturity: "planned" },
    ],
  },
  {
    id: "ai",
    label: "هوش مصنوعی",
    items: [
      { id: "ai-perf", label: "عملکرد مدل‌ها", href: "/ai/performance", maturity: "mock" },
      { id: "classification", label: "ارزیابی طبقه‌بندی", href: "/ai/classification", maturity: "planned" },
      { id: "confidence", label: "توزیع اطمینان", href: "/ai/confidence", maturity: "planned" },
      { id: "monitoring", label: "پایش مدل", href: "/ai/monitoring", maturity: "planned" },
    ],
  },
  {
    id: "reports",
    label: "گزارش‌ها",
    items: [
      { id: "standard-reports", label: "گزارش‌های استاندارد", href: "/reports/standard", maturity: "mock" },
      { id: "custom-reports", label: "گزارش‌های سفارشی", href: "/reports/custom", maturity: "planned" },
      { id: "export", label: "مرکز خروجی", href: "/reports/export", maturity: "mock" },
    ],
  },
  {
    id: "admin",
    label: "مدیریت سامانه",
    items: [
      { id: "users", label: "کاربران و نقش‌ها", href: "/admin/users", maturity: "mock" },
      { id: "sources", label: "منابع داده", href: "/admin/sources", maturity: "mock" },
      { id: "integration", label: "پایش یکپارچه‌سازی", href: "/admin/integration", maturity: "mock" },
      { id: "audit", label: "لاگ ممیزی", href: "/admin/audit", maturity: "mock" },
      { id: "settings", label: "تنظیمات سامانه", href: "/admin/settings", maturity: "mock" },
    ],
  },
];

export const maturityLabel: Record<NavMaturity, string> = {
  active: "فعال",
  mock: "نمایشی",
  planned: "آینده",
};
