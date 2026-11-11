"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers/mockProvider";
import type { TopicExplorerData } from "@/data/providers/types";
import { cn, formatFaNumber, formatFaPercent } from "@/lib/utils";
import { Network, Sparkles } from "lucide-react";

const brand = "#0f766e";
const slate = "#64748b";
const amber = "#d97706";

export function TopicClusterExplorer() {
  const [data, setData] = useState<TopicExplorerData | null>(null);
  const [selectedId, setSelectedId] = useState("t1");

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getTopicExplorer()
      .then((res) => {
        if (alive) {
          setData(res);
          setSelectedId(res.clusters[0]?.id ?? "t1");
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const selected = useMemo(
    () => data?.clusters.find((c) => c.id === selectedId) ?? data?.clusters[0] ?? null,
    [data, selectedId],
  );

  const sizeOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const rows = [...data.clusters].reverse();
    return {
      color: [brand],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 170, right: 20, top: 8, bottom: 24 },
      xAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
      yAxis: {
        type: "category",
        data: rows.map((r) => r.name),
        axisLabel: { color: slate, width: 150, overflow: "truncate" },
      },
      series: [
        {
          type: "bar",
          data: rows.map((r) => ({
            value: r.size,
            itemStyle: { color: r.id === selectedId ? amber : brand },
          })),
          barWidth: 12,
        },
      ],
    };
  }, [data, selectedId]);

  const evolutionOption = useMemo<EChartsOption>(() => {
    if (!selected) return {};
    return {
      color: [brand],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 16, top: 24, bottom: 36 },
      xAxis: {
        type: "category",
        data: selected.evolution.map((p) => p.label),
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
          data: selected.evolution.map((p) => p.count),
        },
      ],
    };
  }, [selected]);

  const graphOption = useMemo<EChartsOption>(() => {
    if (!data) return {};
    const nodes = data.clusters.map((c) => ({
      id: c.id,
      name: c.name,
      symbolSize: Math.max(28, Math.min(70, c.size / 55)),
      value: c.size,
      category: c.id === "t8" ? 1 : 0,
      label: { show: true, fontSize: 10 },
      itemStyle: {
        color: c.id === selectedId ? amber : c.id === "t8" ? "#94a3b8" : brand,
      },
    }));
    const links = data.relations.map((e) => ({
      source: e.source,
      target: e.target,
      value: e.weight,
      lineStyle: {
        width: Math.max(1, e.weight * 5),
        curveness: 0.2,
        color: "#94a3b8",
      },
    }));
    return {
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: {
        formatter: (p: unknown) => {
          const params = p as {
            dataType?: string;
            name?: string;
            value?: number;
            data?: { source?: string; target?: string; value?: number };
          };
          if (params.dataType === "edge" && params.data) {
            const edge = data.relations.find(
              (r) => r.source === params.data?.source && r.target === params.data?.target,
            );
            return edge
              ? `${edge.reason}<br/>وزن: ${formatFaPercent(edge.weight * 100, 0)}`
              : "";
          }
          return `${params.name}<br/>اندازه: ${formatFaNumber(Number(params.value ?? 0))}`;
        },
      },
      legend: [{ data: ["موضوعات اصلی", "نویز کانال"], bottom: 0 }],
      series: [
        {
          type: "graph",
          layout: "force",
          roam: true,
          draggable: true,
          categories: [{ name: "موضوعات اصلی" }, { name: "نویز کانال" }],
          force: { repulsion: 220, edgeLength: [60, 140] },
          data: nodes,
          links,
          emphasis: { focus: "adjacency" },
          label: {
            fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
            color: "#0f172a",
          },
        },
      ],
    };
  }, [data, selectedId]);

  if (!data || !selected) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری کاوش موضوع و خوشه...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-950">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="font-semibold">وضعیت مدل:</span>
          <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-medium">
            برنامه‌ریزی‌شده / نمایشی
          </span>
          <span className="text-violet-800">{data.meta.label}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-violet-900/80">{data.meta.caveat}</p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.summary.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <ChartCard title="فهرست خوشه‌ها" subtitle="انتخاب برای جزئیات">
          <ul className="max-h-[520px] space-y-1 overflow-y-auto">
            {data.clusters.map((c) => (
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
                  <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[var(--muted)]">
                    <span>{formatFaNumber(c.size)} مورد</span>
                    <span>{formatFaPercent(c.sharePercent)}</span>
                    <span className={c.growthPercent >= 0 ? "text-rose-600" : "text-emerald-700"}>
                      {c.growthPercent >= 0 ? "+" : ""}
                      {formatFaPercent(c.growthPercent)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </ChartCard>

        <div className="space-y-4 xl:col-span-3">
          <ChartCard title="جزئیات خوشه انتخاب‌شده" subtitle={selected.method}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] text-[var(--muted)]">اندازه</div>
                <div className="mt-1 text-xl font-bold">{formatFaNumber(selected.size)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] text-[var(--muted)]">سهم</div>
                <div className="mt-1 text-xl font-bold">{formatFaPercent(selected.sharePercent)}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] text-[var(--muted)]">رشد</div>
                <div className="mt-1 text-xl font-bold text-rose-700">
                  +{formatFaPercent(selected.growthPercent)}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] text-[var(--muted)]">انسجام (نمایشی)</div>
                <div className="mt-1 text-xl font-bold">{formatFaNumber(selected.coherence, 2)}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-600">کلیدواژه‌ها</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-900"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-600">موضوعات دیده‌بان مرتبط</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {selected.linkedSubjectNames.map((name) => (
                  <li key={name} className="rounded-md bg-slate-50 px-2 py-1.5">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </ChartCard>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title="توزیع اندازه خوشه‌ها" subtitle="کلیک از فهرست برای برجسته‌سازی">
              <EChart option={sizeOption} height={280} />
            </ChartCard>
            <ChartCard title="تحول موضوع در زمان" subtitle={selected.name}>
              <EChart option={evolutionOption} height={280} />
            </ChartCard>
          </div>

          <ChartCard
            title="گراف روابط موضوعات"
            subtitle="یال = هم‌رخدادی / ارجاع معنادار (نه تزیینی)"
            action={<Network className="h-4 w-4 text-[var(--muted)]" />}
          >
            <EChart option={graphOption} height={360} />
            <ul className="mt-2 space-y-1 text-[11px] text-[var(--muted)]">
              {data.relations
                .filter((e) => e.source === selectedId || e.target === selectedId)
                .map((e) => (
                  <li key={`${e.source}-${e.target}`}>
                    • {e.reason} (وزن {formatFaNumber(e.weight, 2)})
                  </li>
                ))}
              {!data.relations.some(
                (e) => e.source === selectedId || e.target === selectedId,
              ) ? (
                <li>برای این خوشه یال مستقیمی تعریف نشده است.</li>
              ) : null}
            </ul>
          </ChartCard>

          <ChartCard title="نمونه‌های نماینده" subtitle="حداقل‌سازی PII — عنوان نمایشی">
            <ul className="divide-y divide-slate-100">
              {selected.samples.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{s.caption}</div>
                    <div className="mt-1 text-[11px] text-[var(--muted)]">{s.id}</div>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    {s.className}
                  </span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
