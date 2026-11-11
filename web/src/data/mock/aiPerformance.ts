import type { AiPerformanceData } from "@/data/providers/types";

/**
 * AI monitoring shell. Metrics are intentionally null / clearly demo.
 * Never present these as production model quality.
 */
export const mockAiPerformance: AiPerformanceData = {
  meta: {
    source: "mock",
    label: "پایش عملکرد هوش مصنوعی — پوسته معماری (مدل عملیاتی وجود ندارد)",
    modelName: "subject-class-assist (planned)",
    modelVersion: "n/a",
    lifecycle: "not_trained",
    caveat:
      "هیچ عدد دقت/F1 زنده‌ای گزارش نمی‌شود. ارقام داخل نمودارها در صورت وجود فقط Placeholder نمایشی برای چیدمان UI هستند و کیفیت مدل را نشان نمی‌دهند.",
  },
  metrics: [
    {
      id: "accuracy",
      label: "Accuracy",
      value: null,
      unit: "percent",
      status: "not_measured",
      hint: "نیازمند مجموعه برچسب‌خورده holdout",
    },
    {
      id: "precision",
      label: "Precision",
      value: null,
      unit: "percent",
      status: "not_measured",
      hint: "پس از ارزیابی طبقه‌بند SubjectClass",
    },
    {
      id: "recall",
      label: "Recall",
      value: null,
      unit: "percent",
      status: "not_measured",
      hint: "پس از ارزیابی طبقه‌بند SubjectClass",
    },
    {
      id: "f1",
      label: "F1-score",
      value: null,
      unit: "percent",
      status: "not_measured",
      hint: "متریک اصلی پذیرش مدل کمکی",
    },
    {
      id: "human-correction",
      label: "نرخ اصلاح انسانی",
      value: null,
      unit: "percent",
      status: "not_measured",
      hint: "نیازمند لاگ HITL",
    },
    {
      id: "latency",
      label: "Latency استنتاج",
      value: null,
      unit: "ms",
      status: "not_measured",
      hint: "پس از سرویس FastAPI/inference",
    },
    {
      id: "drift",
      label: "نمره دریفت",
      value: null,
      unit: "score",
      status: "not_measured",
      hint: "پایش توزیع ورودی در برابر train",
    },
    {
      id: "auto-resolve",
      label: "نرخ حل خودکار",
      value: null,
      unit: "percent",
      status: "not_measured",
      hint: "M2 — فقط با تأیید انسان",
    },
  ],
  confusionMatrix: {
    labels: ["شکایت", "راهنمایی", "گزارش", "پیشنهاد"],
    // Structural demo only — uniform placeholder, not an evaluated model.
    matrix: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    status: "not_measured",
  },
  confidenceBins: [
    { label: "۰–۰٫۲", count: 0 },
    { label: "۰٫۲–۰٫۴", count: 0 },
    { label: "۰٫۴–۰٫۶", count: 0 },
    { label: "۰٫۶–۰٫۸", count: 0 },
    { label: "۰٫۸–۱٫۰", count: 0 },
  ],
  driftSeries: [
    { label: "هفته ۱", score: null },
    { label: "هفته ۲", score: null },
    { label: "هفته ۳", score: null },
    { label: "هفته ۴", score: null },
    { label: "هفته ۵", score: null },
    { label: "هفته ۶", score: null },
  ],
  readinessChecklist: [
    { id: "c1", label: "تعریف مسئله طبقه‌بندی (SubjectClass / Subject)", done: true },
    { id: "c2", label: "استخراج متن پالایش‌شده بدون PII برای آموزش", done: false },
    { id: "c3", label: "ساخت مجموعه برچسب‌خورده و split ارزیابی", done: false },
    { id: "c4", label: "آموزش baseline + مدل فارسی و ثبت متریک‌ها", done: false },
    { id: "c5", label: "سرویس استنتاج با لاگ اطمینان و اصلاح انسانی", done: false },
    { id: "c6", label: "پایش دریفت و آستانه abstain", done: false },
  ],
};
