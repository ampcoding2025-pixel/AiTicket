"use client";

import { useEffect, useMemo, useState } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { getAnalyticsProvider } from "@/data/providers/mockProvider";
import type {
  ReportFormat,
  ReportsCenterData,
  ReportStatus,
  StandardReport,
} from "@/data/providers/types";
import { cn } from "@/lib/utils";
import { Download, FileSpreadsheet, FileText, CheckCircle2, Clock3, XCircle } from "lucide-react";

const categoryLabel: Record<StandardReport["category"], string> = {
  executive: "مدیریتی",
  category: "دسته‌بندی",
  unit: "واحد سازمانی",
  knowledge: "دانش",
  period: "مقایسه دوره‌ای",
};

const statusLabel: Record<ReportStatus, string> = {
  ready_stub: "آماده (نمایشی)",
  needs_live_data: "نیازمند داده زنده",
  planned: "برنامه‌ریزی‌شده",
};

const statusStyle: Record<ReportStatus, string> = {
  ready_stub: "bg-emerald-50 text-emerald-800 border-emerald-200",
  needs_live_data: "bg-amber-50 text-amber-900 border-amber-200",
  planned: "bg-slate-100 text-slate-600 border-slate-200",
};

export function ReportsCenter({ mode = "standard" }: { mode?: "standard" | "export" }) {
  const [data, setData] = useState<ReportsCenterData | null>(null);
  const [selectedId, setSelectedId] = useState("r-exec-monthly");
  const [toast, setToast] = useState<string | null>(null);
  const [category, setCategory] = useState<"all" | StandardReport["category"]>("all");

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getReportsCenter()
      .then((res) => {
        if (alive) {
          setData(res);
          setSelectedId(res.reports[0]?.id ?? "r-exec-monthly");
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const reports = useMemo(() => {
    if (!data) return [];
    if (category === "all") return data.reports;
    return data.reports.filter((r) => r.category === category);
  }, [data, category]);

  const selected = useMemo(() => {
    if (!data) return null;
    return data.reports.find((r) => r.id === selectedId) ?? reports[0] ?? data.reports[0] ?? null;
  }, [data, selectedId, reports]);

  function requestExport(report: StandardReport, format: ReportFormat) {
    if (report.status === "planned") {
      setToast("این گزارش به‌خاطر KPI ناموجود غیرفعال است.");
      return;
    }
    setToast(
      `درخواست خروجی ${format.toUpperCase()} برای «${report.name}» ثبت شد (شبیه‌سازی — فایل واقعی ساخته نشد).`,
    );
    window.setTimeout(() => setToast(null), 3500);
  }

  if (!data || !selected) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری مرکز گزارش...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        <div className="font-semibold">{data.meta.label}</div>
        <p className="mt-1 text-xs leading-5 text-sky-900/80">{data.meta.note}</p>
      </div>

      {toast ? (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
          {toast}
        </div>
      ) : null}

      {mode === "standard" ? (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <ChartCard
            title="گزارش‌های استاندارد"
            subtitle="فیلتر موضوعی"
            action={
              <select
                className="rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs"
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                aria-label="دسته گزارش"
              >
                <option value="all">همه</option>
                <option value="executive">مدیریتی</option>
                <option value="category">دسته‌بندی</option>
                <option value="unit">واحد سازمانی</option>
                <option value="knowledge">دانش</option>
                <option value="period">مقایسه دوره‌ای</option>
              </select>
            }
          >
            <ul className="max-h-[560px] space-y-1 overflow-y-auto">
              {reports.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-right transition",
                      selectedId === r.id
                        ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                        : "border-transparent hover:bg-slate-50",
                    )}
                  >
                    <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                      <span className="text-[var(--muted)]">{categoryLabel[r.category]}</span>
                      <span className={cn("rounded border px-1.5 py-0.5", statusStyle[r.status])}>
                        {statusLabel[r.status]}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </ChartCard>

          <div className="space-y-4 xl:col-span-3">
            <ChartCard title="جزئیات گزارش" subtitle={selected.id}>
              <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{selected.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={cn("rounded border px-2 py-0.5 text-xs", statusStyle[selected.status])}>
                  {statusLabel[selected.status]}
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {categoryLabel[selected.category]}
                </span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  آخرین تولید: {selected.lastGeneratedLabel}
                </span>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
                <div className="text-[11px] text-[var(--muted)]">وابستگی به KPI</div>
                <div className="mt-1 font-medium text-slate-800">
                  {selected.dependsOnKpis.join(" · ")}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selected.formats.includes("pdf") ? (
                  <button
                    type="button"
                    disabled={selected.status === "planned"}
                    onClick={() => requestExport(selected, "pdf")}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white",
                      selected.status === "planned"
                        ? "cursor-not-allowed bg-slate-300"
                        : "bg-[var(--brand)] hover:bg-[var(--brand-strong)]",
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    خروجی PDF (Stub)
                  </button>
                ) : null}
                {selected.formats.includes("xlsx") ? (
                  <button
                    type="button"
                    disabled={selected.status === "planned"}
                    onClick={() => requestExport(selected, "xlsx")}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium",
                      selected.status === "planned"
                        ? "cursor-not-allowed border-slate-200 text-slate-400"
                        : "border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand-soft)]",
                    )}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    خروجی Excel (Stub)
                  </button>
                ) : null}
              </div>
            </ChartCard>

            <ChartCard title="پیش‌نمایش ساختار گزارش" subtitle="بخش‌های محتوایی پیشنهادی">
              <ol className="list-decimal space-y-2 pe-5 text-sm leading-7 text-slate-700">
                <li>پوشش و فیلترهای دوره / واحد / طبقه</li>
                <li>کارت‌های KPI وابسته ({selected.dependsOnKpis.join("، ")})</li>
                <li>نمودارهای خلاصه و جدول تفصیلی</li>
                <li>یادداشت محدودیت‌ها و وضعیت امکان‌سنجی داده</li>
                <li>پاورقی حداقل‌سازی داده شخصی</li>
              </ol>
            </ChartCard>
          </div>
        </section>
      ) : null}

      <ChartCard
        title="مرکز خروجی — صف اخیر"
        subtitle="وضعیت jobهای نمایشی"
        action={<Download className="h-4 w-4 text-[var(--muted)]" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-[var(--muted)]">
                <th className="py-2 font-medium">گزارش</th>
                <th className="py-2 font-medium">قالب</th>
                <th className="py-2 font-medium">زمان درخواست</th>
                <th className="py-2 font-medium">وضعیت</th>
                <th className="py-2 font-medium">یادداشت</th>
              </tr>
            </thead>
            <tbody>
              {data.recentExports.map((job) => (
                <tr key={job.id} className="border-b border-slate-50">
                  <td className="py-3 font-medium text-slate-900">{job.reportName}</td>
                  <td className="py-3 uppercase">{job.format}</td>
                  <td className="py-3 text-xs text-slate-500">{job.requestedAt}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      {job.status === "done_stub" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      ) : job.status === "queued" ? (
                        <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                      )}
                      {job.status === "done_stub"
                        ? "انجام‌شده (Stub)"
                        : job.status === "queued"
                          ? "در صف"
                          : "ناموفق (Stub)"}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-slate-500">{job.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
