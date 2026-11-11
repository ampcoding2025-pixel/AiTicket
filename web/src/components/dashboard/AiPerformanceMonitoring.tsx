"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers/mockProvider";
import type { AiMetricStatus, AiPerformanceData } from "@/data/providers/types";
import { cn, formatFaNumber, formatFaPercent } from "@/lib/utils";
import { Bot, CheckCircle2, Circle } from "lucide-react";

const brand = "#0f766e";
const slate = "#64748b";

const statusLabel: Record<AiMetricStatus, string> = {
  not_measured: "اندازه‌گیری نشده",
  demo_placeholder: "Placeholder نمایشی",
  live: "زنده",
};

const lifecycleLabel: Record<AiPerformanceData["meta"]["lifecycle"], string> = {
  not_trained: "آموزش‌نداده",
  offline_eval: "ارزیابی آفلاین",
  shadow: "سایه / آزمایشی",
  production: "عملیاتی",
};

function formatMetric(value: number | null, unit: AiPerformanceData["metrics"][number]["unit"]) {
  if (value == null) return "—";
  if (unit === "percent") return formatFaPercent(value);
  if (unit === "ms") return `${formatFaNumber(value)} ms`;
  if (unit === "score") return formatFaNumber(value, 2);
  return formatFaNumber(value);
}

export function AiPerformanceMonitoring() {
  const [data, setData] = useState<AiPerformanceData | null>(null);

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getAiPerformance()
      .then((res) => {
        if (alive) setData(res);
      });
    return () => {
      alive = false;
    };
  }, []);

  const confidenceOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [brand],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 16, top: 24, bottom: 36 },
      xAxis: {
        type: "category",
        data: data.confidenceBins.map((b) => b.label),
        axisLabel: { color: slate },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        axisLabel: { color: slate },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          type: "bar",
          data: data.confidenceBins.map((b) => b.count),
          barWidth: 28,
        },
      ],
    };
  }, [data]);

  const driftOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: ["#94a3b8"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 16, top: 24, bottom: 36 },
      xAxis: {
        type: "category",
        data: data.driftSeries.map((p) => p.label),
        axisLabel: { color: slate },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 1,
        axisLabel: { color: slate },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          type: "line",
          data: data.driftSeries.map((p) => p.score),
          connectNulls: false,
        },
      ],
    };
  }, [data]);

  const matrixOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const labels = data.confusionMatrix.labels;
    const heat = data.confusionMatrix.matrix.flatMap((row, i) =>
      row.map((v, j) => [j, i, v]),
    );
    return {
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: {
        formatter: (p: unknown) => {
          const params = p as { value?: number[] };
          const v = params.value ?? [];
          return `واقعی: ${labels[v[1] ?? 0]} / پیش‌بینی: ${labels[v[0] ?? 0]} = ${formatFaNumber(v[2] ?? 0)}`;
        },
      },
      grid: { left: 90, right: 24, top: 20, bottom: 60 },
      xAxis: {
        type: "category",
        data: labels,
        splitArea: { show: true },
        axisLabel: { color: slate, rotate: 20 },
      },
      yAxis: {
        type: "category",
        data: labels,
        splitArea: { show: true },
        axisLabel: { color: slate },
      },
      visualMap: {
        min: 0,
        max: 1,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        inRange: { color: ["#f8fafc", "#99f6e4", "#0f766e"] },
        show: false,
      },
      series: [
        {
          type: "heatmap",
          data: heat,
          label: {
            show: true,
            formatter: () => "۰",
            fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
          },
        },
      ],
    };
  }, [data]);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری پوسته پایش هوش مصنوعی...
      </div>
    );
  }

  const doneCount = data.readinessChecklist.filter((c) => c.done).length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-violet-300 bg-violet-50 px-4 py-3 text-sm text-violet-950">
        <div className="flex flex-wrap items-center gap-2">
          <Bot className="h-4 w-4" />
          <span className="rounded bg-white px-2 py-0.5 text-xs font-bold text-violet-800">
            نمایشی (Mock) — تولید نشده
          </span>
          <span className="font-semibold">{data.meta.label}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-violet-900/85">{data.meta.caveat}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-violet-900">
          <span>مدل: {data.meta.modelName}</span>
          <span>نسخه: {data.meta.modelVersion}</span>
          <span>چرخه حیات: {lifecycleLabel[data.meta.lifecycle]}</span>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs text-[var(--muted)]">{m.label}</div>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                {statusLabel[m.status]}
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {formatMetric(m.value, m.unit)}
            </div>
            <p className="mt-2 text-[11px] leading-4 text-slate-400">{m.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard
          title="ماتریس درهم‌ریختگی (ساختار UI)"
          subtitle="همه مقادیر صفر — هنوز ارزیابی نشده"
        >
          <EChart option={matrixOption} height={320} />
        </ChartCard>
        <ChartCard
          title="توزیع اطمینان"
          subtitle="بدون استنتاج واقعی — شمارنده‌ها صفر"
        >
          <EChart option={confidenceOption} height={320} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ChartCard title="پایش دریفت" subtitle="سری زمانی خالی تا فعال‌سازی مدل">
            <EChart option={driftOption} height={280} />
          </ChartCard>
        </div>
        <div className="xl:col-span-2">
          <ChartCard
            title="چک‌لیست آمادگی M2"
            subtitle={`${formatFaNumber(doneCount)} از ${formatFaNumber(data.readinessChecklist.length)}`}
          >
            <ul className="space-y-2">
              {data.readinessChecklist.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
                    item.done
                      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                      : "border-slate-100 bg-white text-slate-700",
                  )}
                >
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                  )}
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
