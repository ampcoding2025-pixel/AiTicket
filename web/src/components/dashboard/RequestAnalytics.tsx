"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers/mockProvider";
import type { RequestAnalyticsData } from "@/data/providers/types";
import { formatFaNumber } from "@/lib/utils";

const brand = "#0f766e";
const slate = "#64748b";

export function RequestAnalytics() {
  const [data, setData] = useState<RequestAnalyticsData | null>(null);

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getRequestAnalytics()
      .then((res) => {
        if (alive) setData(res);
      });
    return () => {
      alive = false;
    };
  }, []);

  const classOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [brand, "#d97706", "#0ea5e9", "#94a3b8"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          type: "pie",
          radius: ["40%", "68%"],
          data: data.byClass.map((c) => ({ name: c.name, value: c.value })),
          label: { formatter: "{b}" },
        },
      ],
    };
  }, [data]);

  const groupOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const rows = [...data.bySubjectGroup].reverse();
    return {
      color: [brand],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 160, right: 20, top: 8, bottom: 24 },
      xAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
      yAxis: {
        type: "category",
        data: rows.map((r) => r.name),
        axisLabel: { color: slate, width: 140, overflow: "truncate" },
      },
      series: [{ type: "bar", data: rows.map((r) => r.value), barWidth: 12 }],
    };
  }, [data]);

  const compareOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [brand, "#94a3b8"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      legend: { data: ["دوره جاری", "دوره قبل"], bottom: 0 },
      grid: { left: 40, right: 16, top: 24, bottom: 48 },
      xAxis: {
        type: "category",
        data: data.periodComparison.map((p) => p.label),
        axisLabel: { color: slate },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: slate },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          name: "دوره جاری",
          type: "bar",
          data: data.periodComparison.map((p) => p.current),
        },
        {
          name: "دوره قبل",
          type: "bar",
          data: data.periodComparison.map((p) => p.previous),
        },
      ],
    };
  }, [data]);

  const regionOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const rows = [...data.byRegion].reverse();
    return {
      color: ["#0ea5e9"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 110, right: 20, top: 8, bottom: 24 },
      xAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
      yAxis: { type: "category", data: rows.map((r) => r.name), axisLabel: { color: slate } },
      series: [{ type: "bar", data: rows.map((r) => r.value), barWidth: 12 }],
    };
  }, [data]);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری تحلیل درخواست‌ها...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        <span className="font-semibold">منبع:</span> {data.meta.label}
        <span className="mx-2 text-sky-300">|</span>
        بازه: {data.meta.periodLabel}
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.summary.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="توزیع طبقه درخواست" subtitle="SubjectClass">
          <EChart option={classOption} height={300} />
        </ChartCard>
        <div className="xl:col-span-2">
          <ChartCard title="مقایسه دوره جاری و قبل" subtitle="حجم بر اساس طبقه">
            <EChart option={compareOption} height={300} />
          </ChartCard>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="گروه‌های موضوعی" subtitle="SubjectGroup">
          <EChart option={groupOption} height={340} />
        </ChartCard>
        <ChartCard title="توزیع استانی" subtitle="Inform.RegionId">
          <EChart option={regionOption} height={340} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="کانال ثبت" subtitle="CookieChannel">
          <ul className="divide-y divide-slate-100">
            {data.byChannel.map((c) => (
              <li key={c.name} className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-800">{c.name}</span>
                <span className="font-semibold text-slate-900">{formatFaNumber(c.value)}</span>
              </li>
            ))}
          </ul>
        </ChartCard>
        <ChartCard
          title="نامزدهای تکرار (proxy)"
          subtitle="تا زمان مدل شباهت متنی — لینک ReferringCookieId ضعیف است"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-[var(--muted)]">
                  <th className="py-2 font-medium">موضوع</th>
                  <th className="py-2 font-medium">تعداد</th>
                  <th className="py-2 font-medium">روش</th>
                </tr>
              </thead>
              <tbody>
                {data.repeatedCandidates.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50">
                    <td className="py-3">
                      <div className="font-medium text-slate-900">{row.subject}</div>
                      <div className="mt-1 text-[11px] text-slate-400">{row.note}</div>
                    </td>
                    <td className="py-3 font-semibold">{formatFaNumber(row.count)}</td>
                    <td className="py-3 text-xs text-slate-500">{row.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
