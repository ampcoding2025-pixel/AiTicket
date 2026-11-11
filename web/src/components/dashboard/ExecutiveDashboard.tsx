"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers";
import { useDashboardFilters } from "@/data/DashboardFilterContext";
import type { ExecutiveDashboardData, NamedValue } from "@/data/providers/types";
import { formatFaNumber, formatFaPercent } from "@/lib/utils";
import { AlertTriangle, Lightbulb, Info } from "lucide-react";
import Link from "next/link";

const brand = "#0f766e";
const slate = "#64748b";
const amber = "#d97706";

function horizontalBarOption(
  rows: NamedValue[],
  opts?: { labelWidth?: number; barWidth?: number },
): EChartsOption {
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  const labelWidth = opts?.labelWidth ?? 130;
  return {
    color: [brand],
    textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (v) => formatFaNumber(Number(v)),
    },
    grid: { left: labelWidth + 16, right: 28, top: 8, bottom: 24 },
    xAxis: {
      type: "value",
      min: 0,
      axisLabel: { color: slate },
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    yAxis: {
      type: "category",
      data: sorted.map((r) => r.name),
      axisLabel: { color: slate, width: labelWidth, overflow: "truncate" },
    },
    series: [
      {
        type: "bar",
        data: sorted.map((r) => r.value),
        barWidth: opts?.barWidth ?? 12,
        label: {
          show: true,
          position: "right",
          color: slate,
          fontSize: 10,
          formatter: (p) => formatFaNumber(Number(p.value)),
        },
      },
    ],
  };
}

export function ExecutiveDashboard() {
  const { filters } = useDashboardFilters();
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    getAnalyticsProvider()
      .getExecutiveDashboard(filters)
      .then((res) => {
        if (alive) setData(res);
      });
    return () => {
      alive = false;
    };
  }, [filters.period, filters.subjectClassId]);

  const volumeOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [brand, amber],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      legend: { data: ["کل پرونده", "شکایت"], bottom: 0 },
      grid: { left: 48, right: 16, top: 24, bottom: 48 },
      xAxis: {
        type: "category",
        data: data.volumeTrend.map((p) => p.label),
        axisLabel: { color: slate, hideOverlap: true },
      },
      yAxis: {
        type: "value",
        min: 0,
        axisLabel: { color: slate },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          name: "کل پرونده",
          type: "line",
          smooth: false,
          showSymbol: false,
          data: data.volumeTrend.map((p) => p.requests),
        },
        {
          name: "شکایت",
          type: "line",
          smooth: false,
          showSymbol: false,
          data: data.volumeTrend.map((p) => p.complaints),
        },
      ],
    };
  }, [data]);

  const classOption = useMemo(
    () => (data ? horizontalBarOption(data.classDistribution, { labelWidth: 110 }) : {}),
    [data],
  );

  const subjectOption = useMemo(
    () => (data ? horizontalBarOption(data.categoryDistribution, { labelWidth: 140 }) : {}),
    [data],
  );

  const orgOption = useMemo(
    () => (data ? horizontalBarOption(data.orgUnitPerformance, { labelWidth: 150, barWidth: 14 }) : {}),
    [data],
  );

  const channelOption = useMemo(() => {
    if (!data) return {};
    const rows = [...data.channelDistribution].sort((a, b) => b.value - a.value);
    const top = rows.slice(0, 8);
    const rest = rows.slice(8);
    const otherSum = rest.reduce((s, r) => s + r.value, 0);
    const chartRows =
      otherSum > 0 ? [...top, { name: "سایر کانال‌ها", value: otherSum }] : top;
    return horizontalBarOption(chartRows, { labelWidth: 120 });
  }, [data]);

  const resolutionStackOption = useMemo<EChartsOption>(() => {
    if (!data?.resolutionStatus.length) return {};
    const total = data.resolutionStatus.reduce((s, r) => s + r.value, 0) || 1;
    const finished = data.resolutionStatus.find((r) => r.name.includes("Finish") || r.name.includes("اتمام") || r.name.includes("دارای"))
      ?? data.resolutionStatus[0];
    const open =
      data.resolutionStatus.find((r) => r !== finished) ?? data.resolutionStatus[1];
    const finishedPct = Math.round((1000 * (finished?.value ?? 0)) / total) / 10;
    const openPct = Math.round((1000 * (open?.value ?? 0)) / total) / 10;

    return {
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { bottom: 0 },
      grid: { left: 16, right: 16, top: 16, bottom: 40 },
      xAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
      yAxis: { type: "category", data: ["سهم FinishTime"] },
      series: [
        {
          name: finished?.name ?? "اتمام‌یافته",
          type: "bar",
          stack: "res",
          barWidth: 28,
          data: [finishedPct],
          itemStyle: { color: brand },
          label: { show: true, formatter: () => `${formatFaPercent(finishedPct)}` },
        },
        {
          name: open?.name ?? "باز",
          type: "bar",
          stack: "res",
          data: [openPct],
          itemStyle: { color: "#94a3b8" },
          label: { show: true, formatter: () => `${formatFaPercent(openPct)}` },
        },
      ],
    };
  }, [data]);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری داشبورد برای بازه انتخابی...
      </div>
    );
  }

  const selected = data.kpis.find((k) => k.id === selectedKpi);
  const primaryKpis = data.kpis.filter((k) => k.feasibility === "feasible");
  const secondaryKpis = data.kpis.filter(
    (k) => k.feasibility === "needs_rules" || k.feasibility === "illustrative",
  );
  const unavailableKpis = data.kpis.filter((k) => k.feasibility === "unavailable");
  const coverage = data.answerCoverage.historicalAvailablePercent;
  const finished = data.resolutionStatus[0];
  const open = data.resolutionStatus[1];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div>
            <span className="font-semibold text-teal-900">مخاطب:</span>{" "}
            <span className="text-slate-700">مدیران ارشد / راهبران تحلیل (موقت تا تأیید نقش)</span>
          </div>
          <div className="text-slate-600">بازه واقعی داده: {data.meta.periodLabel}</div>
        </div>
        <div className="mt-2 text-sm font-semibold leading-7 text-slate-900">
          {data.bigIdea ?? "جمع‌بندی بازه هنوز ساخته نشده است."}
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {data.meta.label} · {data.meta.domainNote}
        </p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {primaryKpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            periodLabel={data.meta.periodLabel}
            onOpen={setSelectedKpi}
          />
        ))}
      </section>

      {secondaryKpis.length ? (
        <section>
          <div className="mb-2 text-xs font-semibold text-[var(--muted)]">
            شاخص‌های نیازمند قاعده (اولویت دوم)
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {secondaryKpis.map((kpi) => (
              <KpiCard
                key={kpi.id}
                kpi={kpi}
                periodLabel={data.meta.periodLabel}
                onOpen={setSelectedKpi}
              />
            ))}
          </div>
        </section>
      ) : null}

      {unavailableKpis.length ? (
        <section className="space-y-2">
          <div className="text-xs font-semibold text-[var(--muted)]">ناموجود در دیده‌بان</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {unavailableKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} compact onOpen={setSelectedKpi} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="روند حجم پرونده و شکایت"
            subtitle={data.volumeTrend.length ? "ماهانه · خط مستقیم · بدون پر کردن سطح" : "سری زمانی در دسترس نیست"}
          >
            {data.volumeTrend.length ? (
              <EChart option={volumeOption} height={300} />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-[var(--muted)]">
                نمودار روند برای این بازه خالی است.
              </div>
            )}
          </ChartCard>
        </div>
        <ChartCard title="توزیع SubjectClass" subtitle="میله افقی مرتب‌شده · مقایسه طبقه">
          <EChart option={classOption} height={300} />
        </ChartCard>
      </section>

      <section>
        <ChartCard
          title="اقدام پیشنهادی بر اساس شواهد"
          subtitle="فقط جایی که داده پشتیبانی می‌کند — بدون ادعای NLP یا SLA"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {data.insights.map((insight) => {
              const Icon =
                insight.severity === "attention"
                  ? AlertTriangle
                  : insight.severity === "opportunity"
                    ? Lightbulb
                    : Info;
              const tone =
                insight.severity === "attention"
                  ? "border-amber-200 bg-amber-50 text-amber-950"
                  : insight.severity === "opportunity"
                    ? "border-teal-200 bg-teal-50 text-teal-950"
                    : "border-sky-200 bg-sky-50 text-sky-950";
              return (
                <article key={insight.id} className={`rounded-xl border p-3 ${tone}`}>
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <h4 className="text-sm font-bold">{insight.title}</h4>
                  </div>
                  <p className="text-xs leading-6 opacity-90">{insight.body}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link className="rounded-md bg-white px-2.5 py-1.5 text-teal-800 ring-1 ring-teal-200" href="/knowledge/answers">
              پوشش پاسخ تاریخی
            </Link>
            <Link className="rounded-md bg-white px-2.5 py-1.5 text-teal-800 ring-1 ring-teal-200" href="/analytics/categories">
              کاوش دسته‌بندی
            </Link>
            <Link className="rounded-md bg-white px-2.5 py-1.5 text-teal-800 ring-1 ring-teal-200" href="/performance/kpi">
              پایش شاخص‌ها
            </Link>
          </div>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="موضوعات پرتکرار (Subject)"
            subtitle="یک نمودار میله‌ای — بدون لیست تکراری و بدون نشان رشد جعلی"
          >
            <EChart option={subjectOption} height={300} />
          </ChartCard>
        </div>
        <ChartCard title="پوشش پاسخ شهروند" subtitle="Availability · یک عدد · Validity ناموجود">
          <div className="flex h-[200px] flex-col justify-center gap-4 px-1">
            <div>
              <div className="text-xs text-[var(--muted)]">پاسخ شهروند موجود</div>
              <div className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
                {formatFaPercent(coverage)}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">{data.meta.periodLabel}</div>
            </div>
            <div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${Math.min(100, Math.max(0, coverage))}%` }}
                />
              </div>
              <p className="mt-3 text-[11px] leading-5 text-amber-950">{data.answerCoverage.caveat}</p>
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="کانال ثبت" subtitle="Top کانال‌ها · میله افقی (نه دونات)">
          <EChart option={channelOption} height={280} />
        </ChartCard>
        <ChartCard title="حجم ادارات / واحدها" subtitle="Department volume — نه امتیاز عملکرد">
          <EChart option={orgOption} height={280} />
        </ChartCard>
        {data.resolutionStatus.length >= 2 ? (
          <ChartCard title="اتمام / باز (FinishTime)" subtitle="نیازمند قاعده · میله ۱۰۰٪ به‌جای پای">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-teal-50 p-3">
                <div className="text-[11px] text-teal-800">{finished?.name ?? "اتمام"}</div>
                <div className="mt-1 text-xl font-bold text-teal-950">
                  {formatFaNumber(finished?.value ?? 0)}
                </div>
              </div>
              <div className="rounded-lg bg-slate-100 p-3">
                <div className="text-[11px] text-slate-600">{open?.name ?? "باز"}</div>
                <div className="mt-1 text-xl font-bold text-slate-800">
                  {formatFaNumber(open?.value ?? 0)}
                </div>
              </div>
            </div>
            <EChart option={resolutionStackOption} height={140} />
          </ChartCard>
        ) : (
          <ChartCard title="وضعیت رسیدگی" subtitle="در این منبع متصل نیست">
            <div className="flex h-[280px] items-center justify-center text-sm text-[var(--muted)]">
              دادهٔ اتمام/باز برای نمایش نیست.
            </div>
          </ChartCard>
        )}
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.label}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  جزئیات شاخص در بازه «{data.meta.periodLabel}»
                </p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                onClick={() => setSelectedKpi(null)}
              >
                بستن
              </button>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <div className="text-3xl font-bold text-slate-900">
                {selected.feasibility === "unavailable" || selected.value == null
                  ? "—"
                  : selected.unit === "percent"
                    ? formatFaPercent(selected.value)
                    : selected.unit === "days"
                      ? formatFaNumber(selected.value, 1)
                      : formatFaNumber(selected.value)}
              </div>
              {selected.hint ? (
                <p className="mt-2 text-xs text-slate-500">{selected.hint}</p>
              ) : null}
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              امکان‌سنجی: {selected.feasibility}. برای اقدام عملی از لینک‌های «پوشش پاسخ» یا «پایش
              شاخص‌ها» استفاده کنید.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
