"use client";

import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EChart } from "@/components/charts/EChart";
import { getAnalyticsProvider } from "@/data/providers";
import { useDashboardFilters } from "@/data/DashboardFilterContext";
import type { CategoryExplorerData, CategoryNode, TaxonomyLevel } from "@/data/providers/types";
import { cn, formatFaNumber, formatFaPercent } from "@/lib/utils";
import { ChevronLeft, ChevronDown, FolderTree } from "lucide-react";

const brand = "#0f766e";
const slate = "#64748b";

const levelLabel: Record<TaxonomyLevel, string> = {
  zone: "حیطه",
  nature: "ماهیت / حوزه",
  group: "گروه موضوع",
  subject: "موضوع",
};

function findNode(nodes: CategoryNode[], id: string): CategoryNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const hit = findNode(n.children, id);
      if (hit) return hit;
    }
  }
  return null;
}

function TreeItem({
  node,
  depth,
  selectedId,
  expanded,
  onToggle,
  onSelect,
}: {
  node: CategoryNode;
  depth: number;
  selectedId: string;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = expanded.has(node.id);
  const selected = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 rounded-md py-1.5 pe-2 text-sm transition",
          selected ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "hover:bg-slate-50 text-slate-800",
        )}
        style={{ paddingInlineStart: 8 + depth * 14 }}
      >
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded text-slate-400"
          onClick={() => (hasChildren ? onToggle(node.id) : onSelect(node.id))}
          aria-label={hasChildren ? (isOpen ? "بستن" : "باز کردن") : "انتخاب"}
        >
          {hasChildren ? (
            isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          )}
        </button>
        <button
          type="button"
          className="min-w-0 flex-1 text-right"
          onClick={() => onSelect(node.id)}
        >
          <div className="truncate font-medium">{node.name}</div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--muted)]">
            <span>{levelLabel[node.level]}</span>
            <span>{formatFaNumber(node.count)}</span>
          </div>
        </button>
      </div>
      {hasChildren && isOpen
        ? node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))
        : null}
    </div>
  );
}

export function CategoryExplorer() {
  const [data, setData] = useState<CategoryExplorerData | null>(null);
  const [selectedId, setSelectedId] = useState<string>("zone-rehab");
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(["zone-rehab", "nat-rehab-care", "grp-nursing"]),
  );

  const { filters } = useDashboardFilters();

  useEffect(() => {
    let alive = true;
    getAnalyticsProvider()
      .getCategoryExplorer(filters)
      .then((res) => {
        if (alive) setData(res);
      });
    return () => {
      alive = false;
    };
  }, [filters.period, filters.subjectClassId]);

  const selected = useMemo(() => {
    if (!data) return null;
    return findNode(data.tree, selectedId) ?? data.tree[0] ?? null;
  }, [data, selectedId]);

  const childrenChart = useMemo<EChartsOption>(() => {
    if (!selected?.children?.length) return {};
    const rows = [...selected.children].reverse();
    return {
      color: [brand],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 140, right: 20, top: 8, bottom: 24 },
      xAxis: { type: "value", splitLine: { lineStyle: { color: "#e2e8f0" } } },
      yAxis: {
        type: "category",
        data: rows.map((r) => r.name),
        axisLabel: { color: slate, width: 120, overflow: "truncate" },
      },
      series: [{ type: "bar", data: rows.map((r) => r.count), barWidth: 12 }],
    };
  }, [selected]);

  const growthChart = useMemo<EChartsOption>(() => {
    if (!selected?.children?.length) return {};
    return {
      color: ["#d97706"],
      textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 16, top: 16, bottom: 64 },
      xAxis: {
        type: "category",
        data: selected.children.map((c) => c.name),
        axisLabel: { color: slate, rotate: 25, interval: 110, overflow: "truncate" },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: slate, formatter: "{value}%" },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          type: "bar",
          data: selected.children.map((c) => c.growthPercent),
          barWidth: 18,
        },
      ],
    };
  }, [selected]);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!data || !selected) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
        در حال بارگذاری کاوش دسته‌بندی...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3 text-sm text-teal-950">
        <div className="flex flex-wrap items-center gap-2">
          <FolderTree className="h-4 w-4" />
          <span className="font-semibold">منبع:</span>
          <span>{data.meta.label}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-teal-900/80">{data.meta.note}</p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.summary.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <ChartCard
          title="درخت تاکسونومی"
          subtitle="Zone → Nature → Group → Subject"
          action={
            <span className="text-[11px] text-[var(--muted)]">{data.meta.periodLabel}</span>
          }
        >
          <div className="max-h-[520px] overflow-y-auto pe-1">
            {data.tree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                depth={0}
                selectedId={selectedId}
                expanded={expanded}
                onToggle={toggle}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </ChartCard>

        <div className="space-y-4 xl:col-span-3">
          <ChartCard title="جزئیات گره انتخاب‌شده" subtitle={levelLabel[selected.level]}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] text-[var(--muted)]">نام</div>
                <div className="mt-1 text-sm font-bold text-slate-900">{selected.name}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] text-[var(--muted)]">حجم دوره</div>
                <div className="mt-1 text-xl font-bold text-slate-900">
                  {formatFaNumber(selected.count)}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] text-[var(--muted)]">رشد نسبی</div>
                <div
                  className={cn(
                    "mt-1 text-xl font-bold",
                    selected.growthPercent >= 0 ? "text-rose-700" : "text-emerald-700",
                  )}
                >
                  {selected.growthPercent >= 0 ? "+" : ""}
                  {formatFaPercent(selected.growthPercent)}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-[11px] text-[var(--muted)]">سهم شکایت</div>
                <div className="mt-1 text-xl font-bold text-slate-900">
                  {selected.complaintSharePercent != null
                    ? formatFaPercent(selected.complaintSharePercent)
                    : "—"}
                </div>
              </div>
            </div>
          </ChartCard>

          {selected.children?.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard title="مقایسه فرزندان (حجم)" subtitle="گره‌های سطح پایین‌تر">
                <EChart option={childrenChart} height={280} />
              </ChartCard>
              <ChartCard title="رشد نسبی فرزندان" subtitle="درصد تغییر دوره">
                <EChart option={growthChart} height={280} />
              </ChartCard>
            </div>
          ) : (
            <ChartCard title="رکوردهای نمونه" subtitle="حداقل‌سازی PII — فقط عنوان/طبقه/وضعیت نمایشی">
              {selected.samples?.length ? (
                <ul className="divide-y divide-slate-100">
                  {selected.samples.map((s) => (
                    <li key={s.id} className="py-3">
                      <div className="text-sm font-medium text-slate-900">{s.caption}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[var(--muted)]">
                        <span className="rounded bg-slate-100 px-2 py-0.5">{s.className}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5">{s.status}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5">{s.id}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  برای این موضوع هنوز نمونه نمایشی تعریف نشده است.
                </p>
              )}
            </ChartCard>
          )}

          {selected.children?.length && selected.level !== "subject" ? (
            <ChartCard title="فهرست زیرشاخه‌ها" subtitle="مرتب‌سازی بر اساس حجم">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-right text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-[var(--muted)]">
                      <th className="py-2 font-medium">نام</th>
                      <th className="py-2 font-medium">سطح</th>
                      <th className="py-2 font-medium">حجم</th>
                      <th className="py-2 font-medium">رشد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...selected.children]
                      .sort((a, b) => b.count - a.count)
                      .map((child) => (
                        <tr key={child.id} className="border-b border-slate-50">
                          <td className="py-2.5">
                            <button
                              type="button"
                              className="font-medium text-[var(--brand)] hover:underline"
                              onClick={() => {
                                setSelectedId(child.id);
                                setExpanded((prev) => new Set(prev).add(selected.id));
                              }}
                            >
                              {child.name}
                            </button>
                          </td>
                          <td className="py-2.5 text-xs text-slate-500">
                            {levelLabel[child.level]}
                          </td>
                          <td className="py-2.5 font-semibold">{formatFaNumber(child.count)}</td>
                          <td className="py-2.5 text-xs">
                            {child.growthPercent >= 0 ? "+" : ""}
                            {formatFaPercent(child.growthPercent)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          ) : null}
        </div>
      </section>
    </div>
  );
}
