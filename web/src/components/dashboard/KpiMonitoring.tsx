"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers/mockProvider";
import type {
  DictionaryFeasibility,
  KpiDictionaryItem,
  KpiGroup,
  KpiMonitoringData,
} from "@/data/providers/types";
import { cn, formatFaNumber, formatFaPercent } from "@/lib/utils";
import { Search } from "lucide-react";

const brand = "#0f766e";
const slate = "#64748b";

const groupLabel: Record<KpiGroup, string> = {
  volume: "حجم",
  resolution: "رسیدگی",
  operational: "عملیاتی",
  knowledge: "دانش تاریخی",
  ai: "هوش مصنوعی",
  cx: "تجربه خدمت‌گیرنده",
};

const feasibilityLabel: Record<DictionaryFeasibility, string> = {
  feasible: "قابل محاسبه",
  needs_rules: "نیازمند قاعده",
  weak_proxy: "پروکسی ضعیف",
  unavailable: "در دسترس نیست",
  planned_m2: "برنامه M2",
};

const feasibilityStyle: Record<DictionaryFeasibility, string> = {
  feasible: "bg-emerald-50 text-emerald-800 border-emerald-200",
  needs_rules: "bg-amber-50 text-amber-900 border-amber-200",
  weak_proxy: "bg-orange-50 text-orange-900 border-orange-200",
  unavailable: "bg-slate-100 text-slate-600 border-slate-200",
  planned_m2: "bg-violet-50 text-violet-900 border-violet-200",
};

function formatKpiValue(item: KpiDictionaryItem) {
  if (item.latestValue == null) return "—";
  if (item.unit === "percent") return formatFaPercent(item.latestValue);
  if (item.unit === "days") return formatFaNumber(item.latestValue, 1);
  if (item.unit === "ratio") return formatFaNumber(item.latestValue, 2);
  return formatFaNumber(item.latestValue);
}

export function KpiMonitoring() {
  const [data, setData] = useState<KpiMonitoringData | null>(null);
  const [group, setGroup] = useState<"all" | KpiGroup>("all");
  const [feasibility, setFeasibility] = useState<"all" | DictionaryFeasibility>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("a1");

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getKpiMonitoring()
      .then((res) => {
        if (alive) {
          setData(res);
          setSelectedId(res.items[0]?.id ?? "a1");
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.items.filter((item) => {
      if (group !== "all" && item.group !== group) return false;
      if (feasibility !== "all" && item.feasibility !== feasibility) return false;
      if (query.trim()) {
        const q = query.trim();
        const hay = `${item.code} ${item.name} ${item.definition} ${item.formula}`;
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, group, feasibility, query]);

  const selected = useMemo(() => {
    if (!data) return null;
    return data.items.find((i) => i.id === selectedId) ?? filtered[0] ?? data.items[0] ?? null;
  }, [data, selectedId, filtered]);

  const trendOption = useMemo<EChartsOption>(() => {
    if (!selected?.trend.length) return {};
    return {
      color: [brand],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 16, top: 24, bottom: 36 },
      xAxis: {
        type: "category",
        data: selected.trend.map((p) => p.label),
        axisLabel: { color: slate },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: slate },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          type: "line",
          smooth: true,
          areaStyle: { color: "rgba(15,118,110,0.12)" },
          data: selected.trend.map((p) => p.value),
        },
      ],
    };
  }, [selected]);

  const feasibilityDistOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const entries = Object.entries(data.counts) as [DictionaryFeasibility, number][];
    return {
      color: ["#059669", "#d97706", "#ea580c", "#94a3b8", "#7c3aed"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          type: "pie",
          radius: ["40%", "68%"],
          center: ["50%", "45%"],
          data: entries.map(([k, v]) => ({ name: feasibilityLabel[k], value: v })),
          label: { formatter: "{b}" },
        },
      ],
    };
  }, [data]);

  if (!data || !selected) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری کاتالوگ شاخص‌ها...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-teal-200 bg-teal-50/70 px-4 py-3 text-sm text-teal-950">
        <div className="font-semibold">{data.meta.label}</div>
        <p className="mt-1 text-xs leading-5 text-teal-900/80">{data.meta.note}</p>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {(Object.keys(data.counts) as DictionaryFeasibility[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFeasibility((prev) => (prev === key ? "all" : key))}
            className={cn(
              "rounded-xl border bg-white p-3 text-right transition",
              feasibility === key ? "border-[var(--brand)] ring-2 ring-[var(--brand)]/20" : "border-[var(--border)]",
            )}
          >
            <div className="text-[11px] text-[var(--muted)]">{feasibilityLabel[key]}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {formatFaNumber(data.counts[key])}
            </div>
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="space-y-4 xl:col-span-2">
          <ChartCard title="فیلتر کاتالوگ" subtitle={data.meta.periodLabel}>
            <div className="space-y-3">
              <label className="flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2">
                <Search className="h-4 w-4 text-[var(--muted)]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی نام، کد یا فرمول…"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="rounded-md border border-[var(--border)] bg-white px-2 py-2 text-sm"
                  value={group}
                  onChange={(e) => setGroup(e.target.value as typeof group)}
                  aria-label="گروه شاخص"
                >
                  <option value="all">همه گروه‌ها</option>
                  {(Object.keys(groupLabel) as KpiGroup[]).map((g) => (
                    <option key={g} value={g}>
                      {groupLabel[g]}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-md border border-[var(--border)] bg-white px-2 py-2 text-sm"
                  value={feasibility}
                  onChange={(e) => setFeasibility(e.target.value as typeof feasibility)}
                  aria-label="وضعیت امکان‌سنجی"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  {(Object.keys(feasibilityLabel) as DictionaryFeasibility[]).map((f) => (
                    <option key={f} value={f}>
                      {feasibilityLabel[f]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="فهرست شاخص‌ها" subtitle={`${formatFaNumber(filtered.length)} مورد`}>
            <ul className="max-h-[520px] space-y-1 overflow-y-auto">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-right transition",
                      selectedId === item.id
                        ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                        : "border-transparent hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] text-[var(--muted)]">
                          {item.code} · {groupLabel[item.group]}
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-slate-900">{item.name}</div>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium",
                          feasibilityStyle[item.feasibility],
                        )}
                      >
                        {feasibilityLabel[item.feasibility]}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{formatKpiValue(item)}</div>
                  </button>
                </li>
              ))}
              {!filtered.length ? (
                <li className="py-8 text-center text-sm text-[var(--muted)]">موردی یافت نشد.</li>
              ) : null}
            </ul>
          </ChartCard>
        </div>

        <div className="space-y-4 xl:col-span-3">
          <ChartCard title="جزئیات شاخص" subtitle={`${selected.code} — ${selected.name}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded border px-2 py-0.5 text-xs font-medium",
                  feasibilityStyle[selected.feasibility],
                )}
              >
                {feasibilityLabel[selected.feasibility]}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {groupLabel[selected.group]}
              </span>
              <span className="text-2xl font-bold text-slate-900">{formatKpiValue(selected)}</span>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
                <dt className="text-[11px] text-[var(--muted)]">تعریف کسب‌وکاری</dt>
                <dd className="mt-1 leading-6 text-slate-800">{selected.definition}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
                <dt className="text-[11px] text-[var(--muted)]">فرمول</dt>
                <dd className="mt-1 font-mono text-xs leading-6 text-slate-800 dir-ltr text-left">
                  {selected.formula}
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-[11px] text-[var(--muted)]">فیلدهای مورد نیاز</dt>
                <dd className="mt-1 text-xs leading-6 text-slate-700">
                  {selected.requiredFields.join(" · ")}
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-[11px] text-[var(--muted)]">تجمیع / بُعد زمان</dt>
                <dd className="mt-1 text-xs leading-6 text-slate-700">
                  {selected.aggregation} / {selected.timeDimension}
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-[11px] text-[var(--muted)]">فیلترهای مجاز</dt>
                <dd className="mt-1 text-xs leading-6 text-slate-700">
                  {selected.filters.join(" · ")}
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-[11px] text-[var(--muted)]">تفسیر</dt>
                <dd className="mt-1 text-xs leading-6 text-slate-700">{selected.interpretation}</dd>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 sm:col-span-2">
                <dt className="text-[11px] font-semibold text-amber-900">محدودیت‌ها</dt>
                <dd className="mt-1 text-xs leading-6 text-amber-950">{selected.limitations}</dd>
              </div>
            </dl>
          </ChartCard>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard
              title="روند نمایشی"
              subtitle={
                selected.trend.length
                  ? "سری مصنوعی تا اتصال زنده"
                  : "برای این شاخص روندی تعریف نشده"
              }
            >
              {selected.trend.length ? (
                <EChart option={trendOption} height={260} />
              ) : (
                <div className="flex h-[260px] items-center justify-center text-sm text-[var(--muted)]">
                  مقدار/روند به دلیل Unavailable یا M2 مخفی است.
                </div>
              )}
            </ChartCard>
            <ChartCard title="توزیع وضعیت امکان‌سنجی کاتالوگ" subtitle="بر اساس دیکشنری KPI">
              <EChart option={feasibilityDistOption} height={260} />
            </ChartCard>
          </div>
        </div>
      </section>
    </div>
  );
}
