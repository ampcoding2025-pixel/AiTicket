"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers";
import { useDashboardFilters } from "@/data/DashboardFilterContext";
import type { ExecutiveDashboardData, NamedValue } from "@/data/providers/types";
import { cn, formatFaNumber, formatFaPercent } from "@/lib/utils";
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
    grid: { left: labelWidth + 12, right: 16, top: 8, bottom: 20 },
    xAxis: {
      type: "value",
      min: 0,
      axisLabel: { color: slate },
      splitLine: { lineStyle: { color: "#eef2f7" } },
    },
    yAxis: {
      type: "category",
      data: sorted.map((r) => r.name),
      axisLabel: { color: slate, width: labelWidth, overflow: "truncate" },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data: sorted.map((r) => r.value),
        barWidth: opts?.barWidth ?? 12,
        // Values via tooltip only — reduces chart label clutter (Ch.3)
        label: { show: false },
      },
    ],
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[11px] font-semibold tracking-wide text-slate-500">{children}</h2>
  );
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
        splitLine: { lineStyle: { color: "#eef2f7" } },
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

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری داشبورد برای بازه انتخابی...
      </div>
    );
  }

  const selected = data.kpis.find((k) => k.id === selectedKpi);
  const spotlightIds = new Set(["total-requests", "answer-coverage"]);
  const spotlightKpis = data.kpis.filter((k) => spotlightIds.has(k.id));
  const otherPrimaryKpis = data.kpis.filter(
    (k) => k.feasibility === "feasible" && !spotlightIds.has(k.id),
  );
  const secondaryKpis = data.kpis.filter(
    (k) => k.feasibility === "needs_rules" || k.feasibility === "illustrative",
  );
  const unavailableKpis = data.kpis.filter((k) => k.feasibility === "unavailable");
  const coverage = data.answerCoverage.historicalAvailablePercent;
  const coverageIsException = coverage < 15;
  const attentionInsight = data.insights.find((i) => i.severity === "attention");
  const finished = data.resolutionStatus[0];
  const open = data.resolutionStatus[1];
  const resTotal = (finished?.value ?? 0) + (open?.value ?? 0) || 1;

  return (
    <div className="space-y-8">
      <section className="border-r-4 border-amber-500 bg-amber-50/40 py-4 pr-4 pl-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>مخاطب: مدیران ارشد / راهبران تحلیل (موقت)</span>
          <span>بازه: {data.meta.periodLabel}</span>
        </div>
        <p className="mt-3 text-xl font-bold leading-8 text-slate-900 md:text-2xl">
          {data.bigIdea ?? "جمع‌بندی بازه هنوز ساخته نشده است."}
        </p>
        {attentionInsight ? (
          <p className="mt-3 text-sm leading-6 text-amber-950">
            <span className="font-semibold">توجه: </span>
            {attentionInsight.title} — {attentionInsight.body}
          </p>
        ) : null}
      </section>

      <section>
        <SectionLabel>شاخص‌های محوری داستان</SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spotlightKpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              kpi={kpi}
              emphasis="spotlight"
              exception={kpi.id === "answer-coverage" && coverageIsException}
              onOpen={setSelectedKpi}
            />
          ))}
        </div>
        {otherPrimaryKpis.length ? (
          <div className="mt-4">
            <SectionLabel>سایر شاخص‌های قابل محاسبه</SectionLabel>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {otherPrimaryKpis.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} emphasis="primary" onOpen={setSelectedKpi} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {secondaryKpis.length ? (
        <section>
          <SectionLabel>شاخص‌های نیازمند قاعده</SectionLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {secondaryKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} emphasis="secondary" onOpen={setSelectedKpi} />
            ))}
          </div>
        </section>
      ) : null}

      {unavailableKpis.length ? (
        <section>
          <SectionLabel>ناموجود در دیده‌بان</SectionLabel>
          <div className="divide-y divide-slate-100">
            {unavailableKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} compact onOpen={setSelectedKpi} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionLabel>حجم و طبقه</SectionLabel>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard
              title="روند حجم پرونده و شکایت"
              subtitle={data.volumeTrend.length ? "ماهانه" : "سری زمانی در دسترس نیست"}
            >
              {data.volumeTrend.length ? (
                <EChart option={volumeOption} height={280} />
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-[var(--muted)]">
                  نمودار روند برای این بازه خالی است.
                </div>
              )}
            </ChartCard>
          </div>
          <ChartCard title="توزیع SubjectClass" subtitle="مقایسه طبقات درخواست" flat>
            <EChart option={classOption} height={280} />
          </ChartCard>
        </div>
      </section>

      <section>
        <SectionLabel>اقدام بر اساس شواهد</SectionLabel>
        <ol className="space-y-3 border-t border-[var(--border)] pt-3">
          {data.insights.map((insight, idx) => {
            const isAttention = insight.severity === "attention";
            return (
              <li
                key={insight.id}
                className={cn(
                  "flex gap-3 text-sm",
                  isAttention && "rounded-md border border-amber-200 bg-amber-50/50 p-3",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 w-5 shrink-0 text-xs font-semibold",
                    isAttention ? "text-amber-800" : "text-slate-400",
                  )}
                >
                  {formatFaNumber(idx + 1)}
                </span>
                <div>
                  <div className={cn("font-medium", isAttention ? "text-amber-950" : "text-slate-900")}>
                    {insight.title}
                    <span
                      className={cn(
                        "mr-2 text-[11px] font-semibold",
                        isAttention ? "text-amber-800" : "font-normal text-slate-400",
                      )}
                    >
                      {isAttention ? "توجه" : insight.severity === "opportunity" ? "فرصت" : "اطلاع"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-6 text-slate-600">{insight.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <Link className="text-slate-700 underline-offset-2 hover:underline" href="/knowledge/answers">
            پوشش پاسخ تاریخی
          </Link>
          <Link className="text-slate-700 underline-offset-2 hover:underline" href="/analytics/categories">
            کاوش دسته‌بندی
          </Link>
          <Link className="text-slate-700 underline-offset-2 hover:underline" href="/performance/kpi">
            پایش شاخص‌ها
          </Link>
        </div>
      </section>

      <section>
        <SectionLabel>دانش و موضوعات</SectionLabel>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard title="موضوعات پرتکرار" subtitle="رتبه حجم Subject" flat>
              <EChart option={subjectOption} height={280} />
            </ChartCard>
          </div>
          <ChartCard
            title="پوشش پاسخ شهروند"
            subtitle="جزئیات Availability — در شاخص محوری بالا هم آمده"
            flat
          >
            <div className="flex min-h-[180px] flex-col justify-center">
              {coverageIsException ? (
                <span className="mb-2 w-fit rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                  استثناء · پایین
                </span>
              ) : null}
              <div className="text-xs text-[var(--muted)]">پاسخ شهروند موجود</div>
              <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {formatFaPercent(coverage)}
              </div>
              <p className="mt-3 text-[11px] leading-5 text-slate-500">{data.answerCoverage.caveat}</p>
            </div>
          </ChartCard>
        </div>
      </section>

      <section>
        <SectionLabel>ساختار سازمانی و رسیدگی</SectionLabel>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <ChartCard title="کانال ثبت" subtitle="حجم ورودی" flat>
            <EChart option={channelOption} height={280} />
          </ChartCard>
          <ChartCard title="حجم ادارات / واحدها" subtitle="بر اساس Department" flat>
            <EChart option={orgOption} height={280} />
          </ChartCard>
          {data.resolutionStatus.length >= 2 ? (
            <ChartCard title="اتمام / باز (FinishTime)" subtitle="نیازمند قاعده کسب‌وکار" flat>
              <div className="flex min-h-[200px] flex-col justify-center gap-4">
                <div>
                  <div className="text-xs text-slate-500">{finished?.name ?? "اتمام"}</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">
                    {formatFaNumber(finished?.value ?? 0)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {formatFaPercent(((finished?.value ?? 0) / resTotal) * 100)} از کل
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">{open?.name ?? "باز"}</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">
                    {formatFaNumber(open?.value ?? 0)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {formatFaPercent(((open?.value ?? 0) / resTotal) * 100)} از کل
                  </div>
                </div>
              </div>
            </ChartCard>
          ) : (
            <ChartCard title="وضعیت رسیدگی" subtitle="داده متصل نیست" flat>
              <div className="flex h-[200px] items-center justify-center text-sm text-[var(--muted)]">
                دادهٔ اتمام/باز برای نمایش نیست.
              </div>
            </ChartCard>
          )}
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selected.label}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  بازه «{data.meta.periodLabel}»
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
            <div className="mt-4 rounded-lg bg-slate-50 p-4">
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
