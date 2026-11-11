"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers/mockProvider";
import type { ExecutiveDashboardData } from "@/data/providers/types";
import { formatFaNumber, formatFaPercent } from "@/lib/utils";
import { AlertTriangle, Lightbulb, Info } from "lucide-react";

const brand = "#0f766e";
const slate = "#64748b";
const amber = "#d97706";

export function ExecutiveDashboard() {
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getExecutiveDashboard()
      .then((res) => {
        if (alive) setData(res);
      });
    return () => {
      alive = false;
    };
  }, []);

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
        در حال بارگذاری داده‌های نمایشی...
      </div>
    );
  }

  const selected = data.kpis.find((k) => k.id === selectedKpi);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-teal-200 bg-gradient-to-l from-teal-50 via-white to-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div>
            <span className="font-semibold text-teal-900">منبع داده:</span>{" "}
            <span className="text-slate-700">{data.meta.label}</span>
          </div>
          <div className="text-slate-600">بازه: {data.meta.periodLabel}</div>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">{data.meta.domainNote}</p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} onOpen={setSelectedKpi} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="روند حجم پرونده و شکایت"
            subtitle="مقایسه ماهانه — داده نمایشی با ابعاد دیده‌بان"
          >
            <EChart option={volumeOption} height={300} />
          </ChartCard>
        </div>
        <ChartCard title="توزیع SubjectClass" subtitle="شکایت / راهنمایی / گزارش / پیشنهاد">
          <EChart option={classOption} height={300} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="گروه‌های موضوعی پرتکرار" subtitle="SubjectGroup — نه درمان/بیمه فرضی">
          <EChart option={categoryOption} height={300} />
        </ChartCard>
        <ChartCard title="عملکرد ادارات / واحدها" subtitle="حجم پرونده دوره (نمایشی)">
          <EChart option={orgOption} height={300} />
        </ChartCard>
        <ChartCard title="وضعیت رسیدگی" subtitle="CookieStatus — نیازمند قاعده بسته‌شدن">
          <EChart option={statusOption} height={300} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="کانال ثبت" subtitle="CookieChannel">
          <EChart option={channelOption} height={280} />
        </ChartCard>
        <div className="xl:col-span-2">
          <ChartCard
            title="پوشش پاسخ تاریخی"
            subtitle="Availability واقعی‌نما · Validity در دیده‌بان موجود نیست"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <EChart option={coverageOption} height={220} />
              <div className="grid grid-cols-1 gap-2 self-center text-center text-xs sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                <div className="rounded-lg bg-amber-50 p-3">
                  <div className="text-[var(--muted)]">پاسخ شهروند موجود</div>
                  <div className="mt-1 text-lg font-bold text-amber-900">
                    {formatFaPercent(data.answerCoverage.historicalAvailablePercent)}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <div className="text-[var(--muted)]">معتبر فعلی</div>
                  <div className="mt-1 text-lg font-bold text-slate-500">ناموجود</div>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <div className="text-[var(--muted)]">نیازمند بررسی خبره</div>
                  <div className="mt-1 text-lg font-bold text-slate-500">ناموجود</div>
                </div>
              </div>
            </div>
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] leading-5 text-amber-950">
              {data.answerCoverage.caveat}
            </p>
          </ChartCard>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <ChartCard title="موضوعات پرتکرار / نوظهور" subtitle="برگرفته از Subjectهای دیده‌بان (نمایشی)">
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
                  <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700">
                    +{formatFaPercent(t.growthPercent)}
                  </span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>

        <div className="xl:col-span-3">
          <ChartCard title="بینش‌های تحلیلی اخیر" subtitle="تفسیر نمایشی مبتنی بر یافته‌های بازرسی داده">
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
          </ChartCard>
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.label}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  دریل‌داون نمایشی — پس از قرارداد API به رکوردهای فیلترشده وصل می‌شود.
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
                {selected.feasibility === "unavailable"
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
              اتصال فقط‌خواندنی به دیده‌بان با حداقل‌سازی داده شخصی انجام خواهد شد. شاخص‌های
              Unavailable تا تأمین فیلد/قاعده نمایش داده نمی‌شوند یا خنثی می‌مانند.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
