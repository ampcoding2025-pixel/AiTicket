"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers";
import { useDashboardFilters } from "@/data/DashboardFilterContext";
import type { ExecutiveDashboardData } from "@/data/providers/types";
import { formatFaNumber, formatFaPercent } from "@/lib/utils";
import { AlertTriangle, Lightbulb, Info } from "lucide-react";
import Link from "next/link";

const brand = "#0f766e";
const slate = "#64748b";
const amber = "#d97706";

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
      grid: { left: 40, right: 16, top: 24, bottom: 48 },
      xAxis: {
        type: "category",
        data: data.volumeTrend.map((p) => p.label),
        axisLabel: { color: slate },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: slate },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          name: "کل پرونده",
          type: "line",
          smooth: true,
          areaStyle: { color: "rgba(15,118,110,0.12)" },
          data: data.volumeTrend.map((p) => p.requests),
        },
        {
          name: "شکایت",
          type: "line",
          smooth: true,
          data: data.volumeTrend.map((p) => p.complaints),
        },
      ],
    };
  }, [data]);

  const classOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [brand, amber, "#0ea5e9", "#94a3b8"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "item" },
      legend: { bottom: 0, type: "scroll" },
      series: [
        {
          type: "pie",
          radius: ["42%", "68%"],
          center: ["50%", "45%"],
          data: data.classDistribution.map((c) => ({ name: c.name, value: c.value })),
          label: { formatter: "{b}" },
        },
      ],
    };
  }, [data]);

  const categoryOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [brand],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 140, right: 24, top: 8, bottom: 24 },
      xAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
      yAxis: {
        type: "category",
        data: [...data.categoryDistribution].reverse().map((r) => r.name),
        axisLabel: { color: slate, width: 120, overflow: "truncate" },
      },
      series: [
        {
          type: "bar",
          data: [...data.categoryDistribution].reverse().map((r) => r.value),
          barWidth: 12,
        },
      ],
    };
  }, [data]);

  const orgOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const rows = [...data.orgUnitPerformance].reverse();
    return {
      color: [brand],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 150, right: 24, top: 8, bottom: 24 },
      xAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
      yAxis: { type: "category", data: rows.map((r) => r.name), axisLabel: { color: slate } },
      series: [{ type: "bar", data: rows.map((r) => r.value), barWidth: 14 }],
    };
  }, [data]);

  const statusOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [brand, "#0ea5e9", "#f59e0b", "#ef4444", "#94a3b8"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: "68%",
          data: data.resolutionStatus.map((s) => ({ name: s.name, value: s.value })),
          label: { formatter: "{b}" },
        },
      ],
    };
  }, [data]);

  const channelOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [brand, "#0ea5e9", "#0369a1", "#f59e0b", "#94a3b8"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["40%", "65%"],
          data: data.channelDistribution.map((s) => ({ name: s.name, value: s.value })),
          label: { formatter: "{b}" },
        },
      ],
    };
  }, [data]);

  const coverageOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const v = data.answerCoverage.historicalAvailablePercent;
    return {
      series: [
        {
          type: "gauge",
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          pointer: { show: false },
          progress: { show: true, width: 14, itemStyle: { color: amber } },
          axisLine: { lineStyle: { width: 14, color: [[1, "#e2e8f0"]] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: {
            valueAnimation: true,
            formatter: () => formatFaPercent(v),
            fontSize: 28,
            fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
            color: "#0f172a",
            offsetCenter: [0, "10%"],
          },
          title: {
            offsetCenter: [0, "55%"],
            fontSize: 12,
            color: slate,
            fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
          },
          data: [{ value: v, name: "پاسخ شهروند موجود" }],
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
  const secondaryKpis = data.kpis.filter((k) => k.feasibility !== "feasible");

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
          <KpiCard key={kpi.id} kpi={kpi} onOpen={setSelectedKpi} />
        ))}
      </section>

      {secondaryKpis.length ? (
        <section>
          <div className="mb-2 text-xs font-semibold text-[var(--muted)]">
            شاخص‌های نیازمند قاعده یا ناموجود (اولویت دوم)
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {secondaryKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} onOpen={setSelectedKpi} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="روند حجم پرونده و شکایت"
            subtitle={data.volumeTrend.length ? "ماهانه · CookieTime" : "سری زمانی در دسترس نیست"}
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
        <ChartCard title="توزیع SubjectClass" subtitle="شکایت / راهنمایی / گزارش / پیشنهاد">
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
        <ChartCard title="موضوعات پرتکرار" subtitle="رتبه‌بندی Subject — رشد نسبی محاسبه نشده">
          <ul className="divide-y divide-slate-100">
            {data.emergingTopics.map((t) => (
              <li key={t.rank} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-800">
                    {formatFaNumber(t.rank)}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{t.topic}</div>
                    <div className="mt-1 text-xs text-[var(--muted)]">
                      {formatFaNumber(t.count)} مورد
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
        <ChartCard title="گروه‌های موضوعی پرتکرار" subtitle="از Subjectهای پرتکرار">
          <EChart option={categoryOption} height={280} />
        </ChartCard>
        <ChartCard title="پوشش پاسخ تاریخی" subtitle="Availability · Validity ناموجود">
          <EChart option={coverageOption} height={200} />
          <p className="mt-2 text-[11px] leading-5 text-amber-950">
            {formatFaPercent(data.answerCoverage.historicalAvailablePercent)} پاسخ شهروند ·{" "}
            {data.answerCoverage.caveat}
          </p>
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="کانال ثبت" subtitle="CookieChannel">
          <EChart option={channelOption} height={260} />
        </ChartCard>
        <ChartCard title="حجم ادارات / واحدها" subtitle="بر اساس Department — نه امتیاز عملکرد">
          <EChart option={orgOption} height={260} />
        </ChartCard>
        {data.resolutionStatus.length ? (
          <ChartCard title="اتمام / باز (FinishTime)" subtitle="نیازمند قاعده بسته‌شدن کسب‌وکار">
            <EChart option={statusOption} height={260} />
          </ChartCard>
        ) : (
          <ChartCard title="وضعیت رسیدگی" subtitle="در این منبع متصل نیست">
            <div className="flex h-[260px] items-center justify-center text-sm text-[var(--muted)]">
              نمودار وضعیت مخفی شد چون داده ندارد.
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
