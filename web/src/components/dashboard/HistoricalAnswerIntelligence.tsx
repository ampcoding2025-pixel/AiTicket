"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers";
import { useDashboardFilters } from "@/data/DashboardFilterContext";
import type {
  AnswerIntelligenceData,
  AnswerValidityStatus,
  HistoricalAnswerCase,
} from "@/data/providers/types";
import { cn, formatFaNumber, formatFaPercent } from "@/lib/utils";
import { BookOpenCheck, ShieldAlert } from "lucide-react";

const brand = "#0f766e";
const slate = "#64748b";
const amber = "#d97706";

const validityLabel: Record<AnswerValidityStatus, string> = {
  available_unvalidated: "موجود · اعتبارسنجی‌نشده",
  validity_unknown: "اعتبار نامشخص",
  needs_expert_review: "نیازمند بررسی خبره",
  no_answer: "بدون پاسخ",
};

const validityStyle: Record<AnswerValidityStatus, string> = {
  available_unvalidated: "bg-amber-50 text-amber-900 border-amber-200",
  validity_unknown: "bg-slate-100 text-slate-700 border-slate-200",
  needs_expert_review: "bg-rose-50 text-rose-800 border-rose-200",
  no_answer: "bg-slate-50 text-slate-500 border-slate-200",
};

export function HistoricalAnswerIntelligence() {
  const { filters } = useDashboardFilters();
  const [data, setData] = useState<AnswerIntelligenceData | null>(null);
  const [selectedId, setSelectedId] = useState<string>("case-1");
  const [filter, setFilter] = useState<"all" | AnswerValidityStatus>("all");

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getAnswerIntelligence(filters)
      .then((res) => {
        if (alive) {
          setData(res);
          setSelectedId(res.cases[0]?.id ?? "case-1");
        }
      });
    return () => {
      alive = false;
    };
  }, [filters.period, filters.subjectClassId]);

  const filteredCases = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.cases;
    return data.cases.filter((c) => c.validity === filter);
  }, [data, filter]);

  const selected: HistoricalAnswerCase | null = useMemo(() => {
    if (!data) return null;
    return data.cases.find((c) => c.id === selectedId) ?? filteredCases[0] ?? data.cases[0] ?? null;
  }, [data, selectedId, filteredCases]);

  const breakdownOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const b = data.coverageBreakdown;
    return {
      color: [amber, "#0ea5e9", "#94a3b8"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          type: "pie",
          radius: ["42%", "68%"],
          center: ["50%", "45%"],
          data: [
            { name: "پاسخ شهروند (ReplyCitizen)", value: b.withCitizenReply },
            { name: "فقط یادداشت اپراتور", value: b.withOperatorNoteOnly },
            { name: "بدون متن پاسخ", value: b.withNoTextAnswer },
          ],
          label: { formatter: "{b}" },
        },
      ],
    };
  }, [data]);

  const trendOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [amber],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 16, top: 24, bottom: 36 },
      xAxis: {
        type: "category",
        data: data.coverageTrend.map((p) => p.label),
        axisLabel: { color: slate },
      },
      yAxis: {
        type: "value",
        max: 20,
        axisLabel: { color: slate, formatter: "{value}%" },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          type: "line",
          smooth: true,
          areaStyle: { color: "rgba(217,119,6,0.12)" },
          data: data.coverageTrend.map((p) => p.availablePercent),
          markLine: {
            symbol: "none",
            data: [{ yAxis: 70, name: "ادعای ۷۰٪" }],
            lineStyle: { color: "#ef4444", type: "dashed" },
            label: {
              formatter: "ادعای ۷۰٪ (تأییدنشده)",
              color: "#b91c1c",
              fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
            },
          },
        },
      ],
    };
  }, [data]);

  const funnelCompareOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    return {
      color: [amber, "#94a3b8", "#94a3b8"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 140, right: 24, top: 8, bottom: 24 },
      xAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
      yAxis: {
        type: "category",
        data: ["نیازمند بررسی خبره", "معتبر فعلی", "پاسخ موجود"],
        axisLabel: { color: slate },
      },
      series: [
        {
          type: "bar",
          barWidth: 18,
          data: [
            { value: 0, itemStyle: { color: "#cbd5e1" }, name: "ناموجود" },
            { value: 0, itemStyle: { color: "#cbd5e1" }, name: "ناموجود" },
            {
              value: data.summary.find((k) => k.id === "available")?.value ?? 6.3,
              itemStyle: { color: amber },
            },
          ],
          label: {
            show: true,
            position: "right",
            formatter: (p: { dataIndex: number; value: number }) =>
              p.dataIndex < 2 ? "ناموجود در دیده‌بان" : formatFaPercent(Number(p.value)),
            fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
          },
        },
      ],
    };
  }, [data]);

  if (!data || !selected) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری هوش پاسخ تاریخی...
      </div>
    );
  }

  const b = data.coverageBreakdown;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <div className="flex flex-wrap items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          <span className="font-semibold">تفکیک اجباری:</span>
          <span>مشابه ≠ پاسخ موجود ≠ معتبر فعلی ≠ تأیید خبره</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-amber-900/90">{data.meta.caveat}</p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.summary.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="ترکیب پوشش متنی" subtitle="ReplyCitizen در برابر یادداشت اپراتور">
          <EChart option={breakdownOption} height={280} />
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="rounded-lg bg-amber-50 p-2">
              <div className="text-[var(--muted)]">پاسخ شهروند</div>
              <div className="mt-1 font-bold">{formatFaNumber(b.withCitizenReply)}</div>
            </div>
            <div className="rounded-lg bg-sky-50 p-2">
              <div className="text-[var(--muted)]">فقط اپراتور</div>
              <div className="mt-1 font-bold">{formatFaNumber(b.withOperatorNoteOnly)}</div>
            </div>
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-[var(--muted)]">بدون متن</div>
              <div className="mt-1 font-bold">{formatFaNumber(b.withNoTextAnswer)}</div>
            </div>
          </div>
        </ChartCard>
        <ChartCard title="روند پوشش پاسخ موجود" subtitle="در برابر خط ادعای ۷۰٪ تأییدنشده">
          <EChart option={trendOption} height={300} />
        </ChartCard>
        <ChartCard title="Availability در برابر Validity" subtitle="شاخص‌های ناموجود خاموش می‌مانند">
          <EChart option={funnelCompareOption} height={300} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <ChartCard
          title="کاوش پرونده‌ها"
          subtitle="درخواست → مشابه → پاسخ → وضعیت اعتبار"
          action={
            <select
              className="rounded-md border border-[var(--border)] bg-white px-2 py-1 text-xs"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              aria-label="فیلتر اعتبار"
            >
              <option value="all">همه</option>
              <option value="available_unvalidated">موجود · اعتبارسنجی‌نشده</option>
              <option value="needs_expert_review">نیازمند بررسی خبره</option>
              <option value="validity_unknown">اعتبار نامشخص</option>
              <option value="no_answer">بدون پاسخ</option>
            </select>
          }
        >
          <ul className="max-h-[520px] space-y-1 overflow-y-auto">
            {filteredCases.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-right transition",
                    selectedId === c.id
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-transparent hover:bg-slate-50",
                  )}
                >
                  <div className="text-sm font-semibold text-slate-900">{c.requestCaption}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                    <span className="text-[var(--muted)]">{c.requestClass}</span>
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5",
                        validityStyle[c.validity],
                      )}
                    >
                      {validityLabel[c.validity]}
                    </span>
                  </div>
                </button>
              </li>
            ))}
            {!filteredCases.length ? (
              <li className="py-6 text-center text-sm text-[var(--muted)]">موردی در این فیلتر نیست.</li>
            ) : null}
          </ul>
        </ChartCard>

        <div className="space-y-4 xl:col-span-3">
          <ChartCard title="جزئیات پرونده انتخاب‌شده" subtitle={selected.id}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <BookOpenCheck className="h-3.5 w-3.5" />
                  درخواست اصلی
                </div>
                <div className="text-sm font-bold text-slate-900">{selected.requestCaption}</div>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div>طبقه: {selected.requestClass}</div>
                  <div>موضوع: {selected.subjectName}</div>
                  <div>واحد: {selected.departmentName}</div>
                  <div>تاریخ: {selected.requestDate}</div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-white p-3">
                <div className="text-[11px] font-semibold text-slate-500">مورد مشابه تاریخی</div>
                {selected.similarCaseId ? (
                  <div className="mt-2 space-y-1 text-sm text-slate-800">
                    <div>
                      شناسه: <span className="font-semibold">{selected.similarCaseId}</span>
                    </div>
                    <div>
                      شباهت نمایشی:{" "}
                      <span className="font-semibold">
                        {selected.similarityScore != null
                          ? formatFaPercent(selected.similarityScore * 100, 0)
                          : "—"}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)]">
                      شباهت به‌تنهایی مجوز استفاده از پاسخ نیست.
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[var(--muted)]">مورد مشابه بازیابی نشده است.</p>
                )}
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] font-semibold text-amber-900">پاسخ تاریخی</div>
                <span
                  className={cn(
                    "rounded border px-2 py-0.5 text-[11px] font-medium",
                    validityStyle[selected.validity],
                  )}
                >
                  {validityLabel[selected.validity]}
                </span>
              </div>
              {selected.answerExcerpt ? (
                <>
                  <p className="mt-2 text-sm leading-7 text-slate-800">{selected.answerExcerpt}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    تاریخ پاسخ: {selected.answerDate ?? "—"}
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-500">پاسخ شهروند برای این پرونده ثبت نشده است.</p>
              )}
              <p className="mt-3 rounded-md bg-white/80 p-2 text-xs leading-5 text-amber-950">
                {selected.validityNote}
              </p>
            </div>
          </ChartCard>

          <ChartCard
            title="پاسخ‌های پرتکرار (reuse نمایشی)"
            subtitle="شمارش reuse تا زمان لاگ بازیابی واقعی تقریبی است"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-right text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-[var(--muted)]">
                    <th className="py-2 font-medium">موضوع پاسخ</th>
                    <th className="py-2 font-medium">دفعات</th>
                    <th className="py-2 font-medium">آخرین استفاده</th>
                    <th className="py-2 font-medium">وضعیت اعتبار</th>
                  </tr>
                </thead>
                <tbody>
                  {data.frequentAnswers.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50">
                      <td className="py-2.5 font-medium text-slate-900">{row.topic}</td>
                      <td className="py-2.5">{formatFaNumber(row.reuseCount)}</td>
                      <td className="py-2.5 text-xs text-slate-500">{row.lastUsed}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded border px-2 py-0.5 text-[11px]",
                            validityStyle[row.validity],
                          )}
                        >
                          {validityLabel[row.validity]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
