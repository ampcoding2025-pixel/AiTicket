"use client";

import type { ExecutiveKpi, KpiFeasibility } from "@/data/providers/types";
import { cn, formatFaNumber, formatFaPercent } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

function formatValue(kpi: ExecutiveKpi) {
  if (kpi.feasibility === "unavailable" || kpi.value == null) return "—";
  if (kpi.unit === "percent") return formatFaPercent(kpi.value);
  if (kpi.unit === "days") return formatFaNumber(kpi.value, 1);
  return formatFaNumber(kpi.value);
}

function unitLabel(kpi: ExecutiveKpi): string | null {
  if (kpi.unit === "percent") return "درصد";
  if (kpi.unit === "days") return "روز";
  if (kpi.unit === "count") return "تعداد";
  return null;
}

const feasibilityLabel: Record<KpiFeasibility, string> = {
  feasible: "قابل محاسبه",
  needs_rules: "نیازمند قاعده",
  unavailable: "در دسترس نیست",
  illustrative: "نمایشی",
};

const feasibilityStyle: Record<KpiFeasibility, string> = {
  feasible: "bg-emerald-50 text-emerald-800",
  needs_rules: "bg-amber-50 text-amber-800",
  unavailable: "bg-slate-100 text-slate-500",
  illustrative: "bg-sky-50 text-sky-800",
};

export function KpiCard({
  kpi,
  onOpen,
  periodLabel,
  compact,
}: {
  kpi: ExecutiveKpi;
  onOpen?: (id: string) => void;
  periodLabel?: string;
  /** Compact row for unavailable / secondary metrics */
  compact?: boolean;
}) {
  const hasDelta = typeof kpi.deltaPercent === "number" && Number.isFinite(kpi.deltaPercent);
  const up = (kpi.deltaPercent ?? 0) >= 0;
  const unavailable = kpi.feasibility === "unavailable";
  const unit = unitLabel(kpi);

  if (compact || unavailable) {
    return (
      <button
        type="button"
        onClick={() => onOpen?.(kpi.id)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 text-right transition hover:border-slate-300"
      >
        <div className="min-w-0">
          <div className="text-xs text-slate-600">{kpi.label}</div>
          {kpi.hint ? <p className="mt-0.5 text-[10px] text-slate-400">{kpi.hint}</p> : null}
        </div>
        <div className="shrink-0 text-left">
          <div className="text-sm font-semibold text-slate-700">{formatValue(kpi)}</div>
          {kpi.feasibility ? (
            <div className={cn("mt-0.5 text-[10px]", feasibilityStyle[kpi.feasibility], "bg-transparent")}>
              {feasibilityLabel[kpi.feasibility]}
            </div>
          ) : null}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen?.(kpi.id)}
      className={cn(
        "group rounded-xl border border-[var(--border)] bg-white p-4 text-right transition hover:border-[var(--brand)]/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs leading-5 text-[var(--muted)]">{kpi.label}</div>
        {kpi.feasibility ? (
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
              feasibilityStyle[kpi.feasibility],
            )}
          >
            {feasibilityLabel[kpi.feasibility]}
          </span>
        ) : null}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{formatValue(kpi)}</div>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
        {unit ? <span>{unit}</span> : null}
        {periodLabel ? <span>· {periodLabel}</span> : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        {hasDelta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
            )}
          >
            {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {formatFaPercent(Math.abs(kpi.deltaPercent!))}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">بدون مقایسه دوره قبل</span>
        )}
        <span className="text-[11px] text-slate-400 opacity-0 transition group-hover:opacity-100">
          جزئیات
        </span>
      </div>
      {kpi.hint ? <p className="mt-2 text-[11px] leading-4 text-slate-400">{kpi.hint}</p> : null}
    </button>
  );
}
