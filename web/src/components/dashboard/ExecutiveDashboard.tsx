"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  opts?: { labelWidth?: number; barWidth?: number; highlightMax?: boolean },
): EChartsOption {
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  const labelWidth = opts?.labelWidth ?? 130;
  const maxValue = sorted.length ? Math.max(...sorted.map((r) => r.value)) : 0;
  const highlightMax = opts?.highlightMax !== false;

  return {
    textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (v) => formatFaNumber(Number(v)),
    },
    grid: { left: labelWidth + 12, right: 48, top: 8, bottom: 20 },
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
        data: sorted.map((r) => ({
          value: r.value,
          itemStyle: {
            color: highlightMax && r.value === maxValue && maxValue > 0 ? amber : brand,
          },
        })),
        barWidth: opts?.barWidth ?? 12,
        // Ch.6: show magnitude on the emphasized (max) bar only
        label: {
          show: true,
          position: "right",
          color: slate,
          fontSize: 11,
          formatter: (p: { value?: number | number[]; dataIndex?: number }) => {
            const v = Array.isArray(p.value) ? Number(p.value[0]) : Number(p.value);
            if (!highlightMax || !Number.isFinite(v) || v !== maxValue || maxValue <= 0) {
              return "";
            }
            return formatFaNumber(v);
          },
        },
      },
    ],
  };
}

function KpiDetailDialog({
  label,
  periodLabel,
  value,
  hint,
  onClose,
}: {
  label: string;
  periodLabel: string;
  value: string;
  hint?: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = "kpi-detail-title";

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-white p-5 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id={titleId} className="text-lg font-bold text-slate-900">
              {label}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">بازه «{periodLabel}»</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            onClick={onClose}
          >
            بستن
          </button>
        </div>
        <div className="mt-4 rounded-lg bg-slate-50 p-4">
          <div className="text-3xl font-bold text-slate-900">{value}</div>
          {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  lead,
}: {
  children: React.ReactNode;
  /** One-line transition into this story beat */
  lead?: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-xs font-semibold tracking-wide text-slate-600">{children}</h2>
      {lead ? <p className="mt-1 text-xs leading-5 text-slate-500">{lead}</p> : null}
    </div>
  );
}

export function ExecutiveDashboard() {
  const { filters } = useDashboardFilters();
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [appendixOpen, setAppendixOpen] = useState(false);

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

  const volumeInsight = useMemo(() => {
    if (!data?.volumeTrend.length) return null;
    const pts = data.volumeTrend;
    const last = pts[pts.length - 1]!;
    const prev = pts.length > 1 ? pts[pts.length - 2] : null;
    if (!prev) {
      return `آخرین نقطه: ${last.label} — ${formatFaNumber(last.requests)} پرونده`;
    }
    const delta = last.requests - prev.requests;
    const dir = delta > 0 ? "افزایش" : delta < 0 ? "کاهش" : "بدون تغییر";
    const deltaText =
      delta === 0 ? "بدون تغییر نسبت به ماه قبل" : `${dir} ${formatFaNumber(Math.abs(delta))} نسبت به ماه قبل`;
    return `${last.label}: حجم کل ${deltaText}. خط پررنگ = کل پرونده؛ خط نازک نارنجی = شکایت.`;
  }, [data]);

  const volumeOption = useMemo<EChartsOption>(() => {
    if (!data?.volumeTrend.length) return {};
    const labels = data.volumeTrend.map((p) => p.label);
    const requests = data.volumeTrend.map((p) => p.requests);
    const complaints = data.volumeTrend.map((p) => p.complaints);
    const lastIdx = labels.length - 1;

    return {
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: {
        trigger: "axis",
        valueFormatter: (v) => formatFaNumber(Number(v)),
      },
      // Direct end labels replace bottom legend (Ch.6 model #1/#2)
      legend: { show: false },
      grid: { left: 48, right: 88, top: 28, bottom: 28 },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisLabel: { color: slate, hideOverlap: true },
      },
      yAxis: {
        type: "value",
        min: 0,
        name: "تعداد",
        nameTextStyle: { color: slate, fontSize: 11 },
        axisLabel: { color: slate },
        splitLine: { lineStyle: { color: "#eef2f7" } },
      },
      series: [
        {
          name: "کل پرونده",
          type: "line",
          smooth: false,
          showSymbol: false,
          symbol: "circle",
          symbolSize: 7,
          data: requests,
          lineStyle: { width: 3, color: brand },
          itemStyle: { color: brand },
          endLabel: {
            show: true,
            formatter: "کل پرونده",
            color: brand,
            fontSize: 11,
            fontWeight: 600,
            distance: 6,
          },
          // Emphasize latest observation (annotation anchor)
          markPoint: {
            symbol: "circle",
            symbolSize: 10,
            data: [{ coord: [labels[lastIdx], requests[lastIdx]], name: "آخرین" }],
            itemStyle: { color: brand },
            label: {
              show: true,
              formatter: formatFaNumber(requests[lastIdx] ?? 0),
              position: "top",
              color: brand,
              fontSize: 11,
              fontWeight: 600,
            },
          },
        },
        {
          name: "شکایت",
          type: "line",
          smooth: false,
          showSymbol: false,
          data: complaints,
          lineStyle: { width: 1.5, color: amber },
          itemStyle: { color: amber },
          endLabel: {
            show: true,
            formatter: "شکایت",
            color: amber,
            fontSize: 11,
            distance: 6,
          },
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

  const hasAppendix =
    secondaryKpis.length > 0 ||
    unavailableKpis.length > 0 ||
    data.resolutionStatus.length >= 2 ||
    otherPrimaryKpis.length > 0;

  return (
    <div className="space-y-8">
      {/* 1 — Beginning: situation + Big Idea */}
      <section className="border-r-4 border-amber-500 bg-amber-50/40 py-4 pr-4 pl-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>مخاطب: مدیران ارشد / راهبران تحلیل (موقت)</span>
          <span>بازه: {data.meta.periodLabel}</span>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          پرسش بازه: وضعیت حجم پرونده و پوشش پاسخ شهروند در دیده‌بان چگونه است؟
        </p>
        <p className="mt-3 text-xl font-bold leading-8 text-slate-900 md:text-2xl">
          {data.bigIdea ?? "جمع‌بندی بازه هنوز ساخته نشده است."}
        </p>
        {attentionInsight ? (
          <p className="mt-3 text-sm leading-6 text-amber-950">
            <span className="font-semibold">توجه: </span>
            {attentionInsight.title} — {attentionInsight.body}
          </p>
        ) : null}
        <p className="mt-3 text-[11px] leading-5 text-slate-500">
          واژه‌ها: «پرونده» = رکورد Cookie در دیده‌بان؛ «طبقه درخواست» = SubjectClass؛ «پوشش
          پاسخ» = وجود متن پاسخ شهروند (Availability) — نه اعتبار قانونی (Validity).
        </p>
      </section>

      {/* 2 — Main results */}
      <section>
        <SectionLabel lead="نتیجهٔ اصلی قبل از جزئیات — برای جزئیات هر شاخص کلیک کنید.">
          نتیجهٔ اصلی
        </SectionLabel>
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
      </section>

      {/* 3 — Evidence: volume */}
      <section>
        <SectionLabel lead="شواهد پشتیبان جمع‌بندی حجم و سهم شکایت در Big Idea.">
          شواهد حجم
        </SectionLabel>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard
              title="روند حجم پرونده و شکایت"
              subtitle={
                data.volumeTrend.length
                  ? (volumeInsight ?? "سری ماهانه تاریخی — بدون پیش‌بینی")
                  : "سری زمانی در دسترس نیست"
              }
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
          <ChartCard
            title="توزیع طبقه درخواست"
            subtitle="مقایسه حجم طبقات — میلهٔ نارنجی = بیشترین"
            flat
          >
            <EChart option={classOption} height={280} />
          </ChartCard>
        </div>
        {otherPrimaryKpis.length ? (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {otherPrimaryKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} emphasis="primary" onOpen={setSelectedKpi} />
            ))}
          </div>
        ) : null}
      </section>

      {/* 4 — Evidence: coverage / topics (single placement; no duplicate hero) */}
      <section>
        <SectionLabel lead="شواهد استثناء پوشش پاسخ و تمرکز موضوعی — بدون ادعای علّت.">
          شواهد پوشش و موضوعات
        </SectionLabel>
        <div className="mb-4 rounded-md border border-slate-200 bg-slate-50/80 p-3 text-xs leading-6 text-slate-700">
          <p className="font-medium text-slate-900">چه چیزی در داده هست / نیست</p>
          <ul className="mt-2 list-disc space-y-1 pr-5">
            <li>
              هست: درصد پرونده‌هایی که متن پاسخ شهروند دارند (
              {formatFaPercent(coverage)}
              ) — معیار Availability.
            </li>
            <li>نیست: علت پایین بودن پوشش، و اعتبار قانونی پاسخ (Validity) در دیده‌بان.</li>
            <li>
              گام بعد: نمونه‌های redact‌شده در{" "}
              <Link className="underline underline-offset-2" href="/knowledge/answers">
                پوشش پاسخ تاریخی
              </Link>
              .
            </li>
          </ul>
          {data.answerCoverage.caveat ? (
            <p className="mt-2 text-slate-500">{data.answerCoverage.caveat}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard
              title="موضوعات پرتکرار"
              subtitle="رتبه حجم موضوع — میلهٔ نارنجی = رتبهٔ اول"
              flat
            >
              <EChart option={subjectOption} height={280} />
            </ChartCard>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <ChartCard title="تمرکز حجم ورودی" subtitle="کانال ثبت" flat>
              <EChart option={channelOption} height={200} />
            </ChartCard>
            <ChartCard title="تمرکز واحدها" subtitle="بر اساس واحد سازمانی" flat>
              <EChart option={orgOption} height={200} />
            </ChartCard>
          </div>
        </div>
      </section>

      {/* 5 — End: implications + next questions */}
      <section className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
        <SectionLabel lead="جمع‌بندی داستان این بازه — تمایز واقعیت اندازه‌گیری‌شده از گام بعدی.">
          نتیجه و اقدام
        </SectionLabel>
        <ol className="space-y-3 border-t border-amber-100 pt-3">
          {data.insights.map((insight, idx) => {
            const isAttention = insight.severity === "attention";
            return (
              <li
                key={insight.id}
                className={cn(
                  "flex gap-3 text-sm",
                  isAttention && "rounded-md border border-amber-200 bg-amber-50/80 p-3",
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
        <div className="mt-4 border-t border-amber-100 pt-3">
          <p className="text-xs font-semibold text-slate-700">پرسش‌ها / گام‌های بعدی</p>
          <ol className="mt-2 list-decimal space-y-2 pr-5 text-xs text-slate-700">
            <li>
              نمونه‌های پاسخ شهروند را در{" "}
              <Link className="font-medium underline underline-offset-2" href="/knowledge/answers">
                پوشش پاسخ تاریخی
              </Link>{" "}
              ببینید (بدون فرض Validity).
            </li>
            <li>
              تمرکز موضوعی را در{" "}
              <Link className="font-medium underline underline-offset-2" href="/analytics/categories">
                کاوش دسته‌بندی
              </Link>{" "}
              عمیق‌تر کنید.
            </li>
            <li>
              تعریف و امکان‌سنجی شاخص‌ها را در{" "}
              <Link className="font-medium underline underline-offset-2" href="/performance/kpi">
                پایش شاخص‌ها
              </Link>{" "}
              مرور کنید.
            </li>
          </ol>
        </div>
      </section>

      {/* Appendix — data limits / rules (collapsed by default) */}
      {hasAppendix ? (
        <section className="border-t border-[var(--border)] pt-4">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            aria-expanded={appendixOpen}
            onClick={() => setAppendixOpen((o) => !o)}
          >
            <span className="font-medium">پیوست: حدود داده و قواعد (خارج از قوس داستان)</span>
            <span className="text-xs text-slate-500">{appendixOpen ? "بستن" : "باز کردن"}</span>
          </button>
          {appendixOpen ? (
            <div className="mt-4 space-y-6">
              {secondaryKpis.length ? (
                <div>
                  <SectionLabel lead="قابل نمایش‌اند اما تعریف بسته‌شدن هنوز نیازمند تأیید کسب‌وکار است.">
                    شاخص‌های نیازمند قاعده
                  </SectionLabel>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {secondaryKpis.map((kpi) => (
                      <KpiCard key={kpi.id} kpi={kpi} emphasis="secondary" onOpen={setSelectedKpi} />
                    ))}
                  </div>
                </div>
              ) : null}
              {unavailableKpis.length ? (
                <div>
                  <SectionLabel>ناموجود در دیده‌بان</SectionLabel>
                  <div className="divide-y divide-slate-100">
                    {unavailableKpis.map((kpi) => (
                      <KpiCard key={kpi.id} kpi={kpi} compact onOpen={setSelectedKpi} />
                    ))}
                  </div>
                </div>
              ) : null}
              {data.resolutionStatus.length >= 2 ? (
                <ChartCard
                  title="اتمام / باز بر اساس زمان اتمام"
                  subtitle="نیازمند قاعده کسب‌وکار — بخشی از داستان اصلی نیست"
                  flat
                >
                  <div className="flex min-h-[160px] flex-col justify-center gap-4 sm:flex-row sm:gap-10">
                    <div>
                      <div className="text-xs text-slate-500">{finished?.name ?? "اتمام"}</div>
                      <div className="mt-1 text-2xl font-bold text-slate-900">
                        {formatFaNumber(finished?.value ?? 0)}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {formatFaPercent(((finished?.value ?? 0) / resTotal) * 100)} از کل
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{open?.name ?? "باز"}</div>
                      <div className="mt-1 text-2xl font-bold text-slate-900">
                        {formatFaNumber(open?.value ?? 0)}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {formatFaPercent(((open?.value ?? 0) / resTotal) * 100)} از کل
                      </div>
                    </div>
                  </div>
                </ChartCard>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {selected ? (
        <KpiDetailDialog
          label={selected.label}
          periodLabel={data.meta.periodLabel}
          value={
            selected.feasibility === "unavailable" || selected.value == null
              ? "—"
              : selected.unit === "percent"
                ? formatFaPercent(selected.value)
                : selected.unit === "days"
                  ? formatFaNumber(selected.value, 1)
                  : formatFaNumber(selected.value)
          }
          hint={selected.hint}
          onClose={() => setSelectedKpi(null)}
        />
      ) : null}
    </div>
  );
}
