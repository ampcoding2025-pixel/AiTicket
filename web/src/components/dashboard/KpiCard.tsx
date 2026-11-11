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
  compact,
}: {
  kpi: ExecutiveKpi;
  onOpen?: (id: string) => void;
  /** Plain text row for unavailable metrics */
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
        className="flex w-full items-baseline justify-between gap-3 py-1.5 text-right text-sm text-slate-600 hover:text-slate-900"
      >
        <span className="min-w-0 truncate">{kpi.label}</span>
        <span className="shrink-0 font-medium text-slate-500">{formatValue(kpi)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen?.(kpi.id)}
      className={cn(
        "rounded-lg border border-[var(--border)] bg-white p-4 text-right transition hover:border-[var(--brand)]/35",
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
      {unit ? <div className="mt-1 text-[11px] text-slate-400">{unit}</div> : null}
      {hasDelta ? (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
          )}
        >
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {formatFaPercent(Math.abs(kpi.deltaPercent!))}
        </div>
      ) : null}
      {kpi.hint ? <p className="mt-2 text-[11px] leading-4 text-slate-400">{kpi.hint}</p> : null}
    </button>
  );
}
