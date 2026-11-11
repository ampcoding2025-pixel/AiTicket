"use client";

import type { ExecutiveKpi, KpiFeasibility } from "@/data/providers/types";
import { cn, formatFaNumber, formatFaPercent } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

function formatValue(kpi: ExecutiveKpi) {
  if (kpi.feasibility === "unavailable") return "—";
  if (kpi.unit === "percent") return formatFaPercent(kpi.value);
  if (kpi.unit === "days") return formatFaNumber(kpi.value, 1);
  return formatFaNumber(kpi.value);
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
}: {
  kpi: ExecutiveKpi;
  onOpen?: (id: string) => void;
}) {
  const delta = kpi.deltaPercent ?? 0;
  const up = delta >= 0;
  const unavailable = kpi.feasibility === "unavailable";

  return (
    <button
      type="button"
      onClick={() => onOpen?.(kpi.id)}
      className={cn(
        "group rounded-xl border border-[var(--border)] bg-white p-4 text-right shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:border-[var(--brand)]/40 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
        unavailable && "opacity-90",
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
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        {formatValue(kpi)}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        {unavailable ? (
          <span className="text-[11px] text-slate-400">بدون فیلد کافی در دیده‌بان</span>
        ) : (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
            )}
          >
            {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {formatFaPercent(Math.abs(delta))}
          </span>
        )}
        <span className="text-[11px] text-slate-400 opacity-0 transition group-hover:opacity-100">
          جزئیات
        </span>
      </div>
      {kpi.hint ? (
        <p className="mt-2 text-[11px] leading-4 text-slate-400">{kpi.hint}</p>
      ) : null}
    </button>
  );
}
