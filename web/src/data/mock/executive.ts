import type { ExecutiveDashboardData } from "@/data/providers/types";

/** Synthetic demo series — not Didban organizational data. */
export const mockExecutiveDashboard: ExecutiveDashboardData = {
  meta: {
    source: "mock",
    label: "داده‌های نمایشی (Mock) — متصل به دیده‌بان نیست",
    periodLabel: "۱۴۰۴/۰۷/۰۱ تا ۱۴۰۴/۰۸/۱۸",
    generatedAt: "2026-11-09T09:00:00.000Z",
  },
  kpis: [
    { id: "total-requests", label: "کل درخواست‌های تاریخی", value: 184520, unit: "count", deltaPercent: 4.2, tone: "neutral" },
    { id: "total-complaints", label: "کل شکایات", value: 41280, unit: "count", deltaPercent: 1.8, tone: "warning" },
    { id: "non-complaint", label: "درخواست‌های غیرشکایت", value: 143240, unit: "count", deltaPercent: 5.1, tone: "positive" },
    { id: "new-period", label: "درخواست‌های دوره انتخابی", value: 12640, unit: "count", deltaPercent: -2.4, tone: "neutral" },
    { id: "resolved", label: "رسیدگی‌شده", value: 10210, unit: "count", deltaPercent: 3.6, tone: "positive" },
    { id: "unresolved", label: "باز / رسیدگی‌نشده", value: 2430, unit: "count", deltaPercent: -6.1, tone: "positive" },
    { id: "avg-response", label: "میانگین زمان پاسخ (روز)", value: 3.4, unit: "days", deltaPercent: -8.2, tone: "positive", hint: "نیازمند تأیید فیلد first_response در دیده‌بان" },
    { id: "avg-resolution", label: "میانگین زمان حل (روز)", value: 9.7, unit: "days", deltaPercent: -3.1, tone: "positive" },
    { id: "resolution-rate", label: "نرخ رسیدگی", value: 80.8, unit: "percent", deltaPercent: 1.4, tone: "positive" },
    { id: "repeated", label: "درصد درخواست‌های تکراری", value: 12.6, unit: "percent", deltaPercent: 0.7, tone: "warning" },
    { id: "answer-coverage", label: "پوشش پاسخ تاریخی", value: 68.4, unit: "percent", deltaPercent: 0.0, tone: "neutral", hint: "دسترسی پاسخ ≠ اعتبار قانونی" },
    { id: "top-category-share", label: "سهم بزرگ‌ترین دسته", value: 37.2, unit: "percent", deltaPercent: 2.1, tone: "neutral" },
  ],
  volumeTrend: [
    { label: "فروردین", requests: 9800, complaints: 2100 },
    { label: "اردیبهشت", requests: 10240, complaints: 2240 },
    { label: "خرداد", requests: 11020, complaints: 2410 },
    { label: "تیر", requests: 11880, complaints: 2680 },
    { label: "مرداد", requests: 12110, complaints: 2550 },
    { label: "شهریور", requests: 12640, complaints: 2710 },
    { label: "مهر", requests: 13120, complaints: 2890 },
    { label: "آبان", requests: 12640, complaints: 2640 },
  ],
  categoryDistribution: [
    { name: "درمان و سلامت", value: 372 },
    { name: "بیمه‌ای", value: 248 },
    { name: "مستمری و بازنشستگی", value: 164 },
    { name: "کارفرمایان", value: 98 },
    { name: "سایر / نامشخص", value: 78 },
  ],
  orgUnitPerformance: [
    { name: "اداره کل غرب تهران", value: 2140 },
    { name: "اداره کل شرق تهران", value: 1980 },
    { name: "اداره کل اصفهان", value: 1620 },
    { name: "اداره کل خراسان رضوی", value: 1510 },
    { name: "اداره کل فارس", value: 1320 },
    { name: "سایر واحدها", value: 4070 },
  ],
  resolutionStatus: [
    { name: "رسیدگی‌شده", value: 10210 },
    { name: "در حال بررسی", value: 1680 },
    { name: "منتظر مدارک", value: 420 },
    { name: "بازگشایی‌شده", value: 180 },
    { name: "بسته بدون اقدام", value: 150 },
  ],
  answerCoverage: {
    historicalAvailablePercent: 68.4,
    currentlyValidPercent: 41.2,
    needsReviewPercent: 27.2,
    caveat:
      "وجود پاسخ تاریخی به‌معنای اعتبار حقوقی فعلی نیست. بخشنامه‌های جدید ممکن است پاسخ قبلی را بی‌اعتبار کنند.",
  },
  emergingTopics: [
    { rank: 1, topic: "تأخیر در به‌روزرسانی سابقه بیمه‌ای", count: 842, growthPercent: 18.4 },
    { rank: 2, topic: "اختلال در نسخه الکترونیک", count: 710, growthPercent: 12.1 },
    { rank: 3, topic: "عدم تطبیق پرداخت مستمری", count: 566, growthPercent: 9.3 },
    { rank: 4, topic: "اشکال در لیست بیمه کارفرما", count: 498, growthPercent: 7.8 },
    { rank: 5, topic: "پیگیری نامه انتقال کسورات", count: 421, growthPercent: 6.2 },
  ],
  insights: [
    {
      id: "i1",
      title: "رشد درخواست‌های درمان نسبت به بیمه‌ای",
      body: "در دوره انتخابی، سهم دسته درمان از کل درخواست‌ها حدود ۳۷٪ بوده و نسبت به دوره قبل افزایش داشته است. (نمایشی)",
      severity: "attention",
    },
    {
      id: "i2",
      title: "شکاف پوشش پاسخ و اعتبار پاسخ",
      body: "حدود ۶۸٪ پوشش پاسخ تاریخی در مقابل حدود ۴۱٪ پاسخ بالقوه معتبر نشان می‌دهد reuse بدون کنترل اعتبار ریسک‌زاست. (نمایشی)",
      severity: "opportunity",
    },
    {
      id: "i3",
      title: "کاهش نسبی میانگین زمان پاسخ",
      body: "میانگین زمان پاسخ نسبت به دوره قبل حدود ۸٪ بهبود داشته؛ نیازمند تأیید پس از اتصال به فیلدهای واقعی. (نمایشی)",
      severity: "info",
    },
  ],
};
