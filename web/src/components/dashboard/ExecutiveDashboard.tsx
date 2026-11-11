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
        label: {
          show: true,
          position: "right",
          color: slate,
          fontSize: 11,
          formatter: (p: { value?: unknown }) => {
            const v = Number(p.value);
            if (!highlightMax || !Number.isFinite(v) || v !== maxValue || maxValue <= 0) {
              return "";
            }
            return formatFaNumber(v);
          },
        },
      },
    ],
  } as EChartsOption;
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

function formatFreshness(generatedAt: string): string {
  const ms = Date.now() - new Date(generatedAt).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "تازگی نامشخص";
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${formatFaNumber(sec)} ثانیه پیش`;
  const min = Math.round(sec / 60);
  return `${formatFaNumber(min)} دقیقه پیش`;
}

export function ExecutiveDashboard() {
  const { filters } = useDashboardFilters();
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [appendixOpen, setAppendixOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const [nowTick, setNowTick] = useState(0);
  const freshRef = useRef(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const wantFresh = freshRef.current;
    freshRef.current = false;
    getAnalyticsProvider()
      .getExecutiveDashboard(filters, { fresh: wantFresh })
      .then((res) => {
        if (alive) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [filters.period, filters.subjectClassId, refreshTick]);

  // Near-real-time: auto re-fetch at cache TTL (default 3 min)
  useEffect(() => {
    const ttlMs = (data?.freshnessSeconds ?? 180) * 1000;
    const id = window.setInterval(() => {
      freshRef.current = true;
      setRefreshTick((t) => t + 1);
    }, ttlMs);
    return () => window.clearInterval(id);
  }, [data?.freshnessSeconds]);

  useEffect(() => {
    const id = window.setInterval(() => setNowTick((n) => n + 1), 15000);
    return () => window.clearInterval(id);
  }, []);

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

  if (!data || (loading && !data)) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری داشبورد برای بازه انتخابی...
      </div>
    );
  }

  const selected = data.kpis.find((k) => k.id === selectedKpi);
  const spotlightIds = [
    "total-requests",
    "d1-complaint",
    "d1-complaint-ex-voice",
    "d1-guidance",
  ];
  const spotlightKpis = spotlightIds
    .map((id) => data.kpis.find((k) => k.id === id))
    .filter((k): k is NonNullable<typeof k> => Boolean(k));
  const decisionSupportIds = new Set([
    "total-complaints",
    "complaint-share",
    "voice-noise-share",
    "auto-register-deadend",
  ]);
  const decisionSupportKpis = data.kpis.filter((k) => decisionSupportIds.has(k.id));
  const secondaryKpis = data.kpis.filter(
    (k) =>
      k.feasibility === "needs_rules" ||
      k.feasibility === "illustrative" ||
      k.id === "answer-coverage" ||
      k.id === "non-complaint",
  );
  const unavailableKpis = data.kpis.filter((k) => k.feasibility === "unavailable");
  const d1c = data.answerCoverage.complaintAvailablePercent ?? null;
  const d1g = data.answerCoverage.guidanceAvailablePercent ?? null;
  const d1x = data.answerCoverage.complaintExVoiceAvailablePercent ?? null;
  const attentionInsight = data.insights.find((i) => i.severity === "attention");
  const finished = data.resolutionStatus[0];
  const open = data.resolutionStatus[1];
  const resTotal = (finished?.value ?? 0) + (open?.value ?? 0) || 1;
  void nowTick;

  const hasAppendix =
    secondaryKpis.length > 0 ||
    unavailableKpis.length > 0 ||
    data.resolutionStatus.length >= 2;

  return (
    <div className="space-y-8">
      {/* Freshness / near-real-time */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex h-2 w-2 rounded-full",
              data.meta.source === "didban" ? "bg-teal-600" : "bg-amber-500",
            )}
            aria-hidden
          />
          <span>
            {data.meta.source === "didban" ? "زنده از دیده‌بان" : "نمایشی"} · بازه{" "}
            {data.meta.periodLabel}
          </span>
          <span className="text-slate-400">|</span>
          <span>
            تازگی: {formatFreshness(data.meta.generatedAt)} · کش سرور ≈{" "}
            {formatFaNumber(data.freshnessSeconds ?? 180)} ثانیه
          </span>
        </div>
        <button
          type="button"
          disabled={loading}
          className="rounded-md border border-teal-700/30 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-900 hover:bg-teal-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          onClick={() => {
            freshRef.current = true;
            setRefreshTick((t) => t + 1);
          }}
        >
          {loading ? "در حال تازه‌سازی…" : "تازه‌سازی فوری"}
        </button>
      </div>

      {/* 1 — Beginning: situation + Big Idea */}
      <section className="border-r-4 border-amber-500 bg-amber-50/40 py-4 pr-4 pl-1">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>مخاطب: تصمیم‌گیران عملیاتی / راهبران تحلیل</span>
          <span>پرسش: کجا پوشش پاسخ را اصلاح کنیم؟</span>
        </div>
        <p className="mt-3 text-xl font-bold leading-8 text-slate-900 md:text-2xl">
          {data.bigIdea ?? "جمع‌بندی بازه هنوز ساخته نشده است."}
        </p>
        {attentionInsight ? (
          <p className="mt-3 text-sm leading-6 text-amber-950">
            <span className="font-semibold">اولویت فوری: </span>
            {attentionInsight.title} — {attentionInsight.body}
          </p>
        ) : null}
        <p className="mt-3 text-[11px] leading-5 text-slate-500">
          D1c/D1g/D1x = Availability متن ReplyCitizen — نه Validity. SLA و FinishTime در پیوست‌اند تا
          قاعده امضا شود.
        </p>
      </section>

      {/* 2 — Main decision KPIs */}
      <section>
        <SectionLabel lead="شاخص‌های تصمیم‌پذیر — شکایت در برابر راهنمایی، نه عدد ترکیبی.">
          نتیجهٔ اصلی برای تصمیم
        </SectionLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {spotlightKpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              kpi={kpi}
              emphasis="spotlight"
              exception={
                (kpi.id === "d1-guidance" && (kpi.value ?? 0) < 5) ||
                (kpi.id === "d1-complaint" && (kpi.value ?? 100) < 40)
              }
              onOpen={setSelectedKpi}
            />
          ))}
        </div>
        {(d1c != null || d1g != null || d1x != null) && (
          <div className="mt-3 rounded-md border border-slate-200 bg-slate-50/80 p-3 text-xs leading-6 text-slate-700">
            <span className="font-medium text-slate-900">خوانش سریع: </span>
            پوشش شکایت {d1c != null ? formatFaPercent(d1c) : "—"}
            {d1x != null ? ` · بدون نویز صوتی ${formatFaPercent(d1x)}` : ""}
            {d1g != null ? ` · راهنمایی ${formatFaPercent(d1g)}` : ""}. عدد ترکیبی D1 را برای هدف‌گذاری
            استفاده نکنید.
          </div>
        )}
      </section>

      {decisionSupportKpis.length ? (
        <section>
          <SectionLabel lead="محرک‌های اقدام — نویز ورودی و بن‌بست مسیریابی.">
            سیگنال‌های اقدام
          </SectionLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {decisionSupportKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} emphasis="primary" onOpen={setSelectedKpi} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href="/knowledge/answers"
              className="rounded-md border border-teal-700/30 bg-teal-50 px-3 py-1.5 font-medium text-teal-900 hover:bg-teal-100"
            >
              تشخیص پوشش بر اساس بُعد
            </Link>
            <Link
              href="/performance/actions"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-800 hover:bg-slate-50"
            >
              ثبت اقدام شاخص
            </Link>
          </div>
        </section>
      ) : null}

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
      </section>

      {/* 4 — Evidence: coverage / topics */}
      <section>
        <SectionLabel lead="شواهد تمرکز موضوعی و کانال — بدون ادعای علّت.">
          شواهد موضوعات و کانال
        </SectionLabel>
        <div className="mb-4 rounded-md border border-slate-200 bg-slate-50/80 p-3 text-xs leading-6 text-slate-700">
          <p className="font-medium text-slate-900">چه چیزی در داده هست / نیست</p>
          <ul className="mt-2 list-disc space-y-1 pr-5">
            <li>
              هست: D1c/D1g/D1x و شمار نویز صوتی / ثبت خودکار از ReplyCitizen + SubjectClass.
            </li>
            <li>نیست: Validity حقوقی، SLA، و علت ریشه‌ای بدون تحقیق میدانی.</li>
            <li>
              گام بعد:{" "}
              <Link className="underline underline-offset-2" href="/knowledge/answers">
                پوشش پاسخ تاریخی
              </Link>{" "}
              و{" "}
              <Link className="underline underline-offset-2" href="/performance/actions">
                ثبت اقدام
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
                      {insight.priority ? `${insight.priority} · ` : ""}
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
              نویز صوتی و ثبت خودکار را در اقدام ثبت کنید —{" "}
              <Link className="font-medium underline underline-offset-2" href="/performance/actions">
                ثبت اقدام شاخص
              </Link>
              .
            </li>
            <li>
              پوشش بعدی را در{" "}
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
