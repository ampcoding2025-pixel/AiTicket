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

/** Feasible = neutral slate (not “good performance”); amber = needs rules */
const feasibilityStyle: Record<KpiFeasibility, string> = {
  feasible: "bg-slate-100 text-slate-700",
  needs_rules: "bg-amber-50 text-amber-900",
  unavailable: "bg-slate-50 text-slate-500",
  illustrative: "bg-slate-100 text-slate-600",
};

export type KpiEmphasis = "spotlight" | "primary" | "secondary";

export function KpiCard({
  kpi,
  onOpen,
  compact,
  emphasis = "primary",
  exception,
}: {
  kpi: ExecutiveKpi;
  onOpen?: (id: string) => void;
  compact?: boolean;
  emphasis?: KpiEmphasis;
  /** Marks a business exception that should draw attention */
  exception?: boolean;
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
        aria-label={`${kpi.label}: ${formatValue(kpi)} — جزئیات`}
        className="flex w-full cursor-pointer items-baseline justify-between gap-3 py-1.5 text-right text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
      >
        <span className="min-w-0 truncate">{kpi.label}</span>
        <span className="shrink-0 font-medium text-slate-500">{formatValue(kpi)}</span>
      </button>
    );
  }

  const isSpotlight = emphasis === "spotlight";
  const isSecondary = emphasis === "secondary";

  return (
    <button
      type="button"
      onClick={() => onOpen?.(kpi.id)}
      aria-label={`${kpi.label}: ${formatValue(kpi)} — برای جزئیات کلیک کنید`}
      className={cn(
        "cursor-pointer text-right transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
        isSpotlight &&
          "rounded-lg border-2 border-amber-400 bg-white p-5 ring-1 ring-amber-100 hover:border-amber-500",
        emphasis === "primary" &&
          "rounded-lg border border-[var(--border)] bg-white p-4 hover:border-slate-300",
        isSecondary && "rounded-md border border-transparent bg-slate-50/80 p-3 hover:bg-slate-50",
        exception && !isSpotlight && "border-amber-300",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cn("leading-5 text-[var(--muted)]", isSpotlight ? "text-sm" : "text-xs")}>
          {kpi.label}
          {exception ? (
            <span className="mr-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-900">
              استثناء
            </span>
          ) : null}
        </div>
        {kpi.feasibility ? (
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 text-xs font-medium",
              feasibilityStyle[kpi.feasibility],
            )}
          >
            {feasibilityLabel[kpi.feasibility]}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          "mt-2 font-bold tracking-tight text-slate-900",
          isSpotlight && "text-3xl",
          emphasis === "primary" && "text-xl",
          isSecondary && "text-lg",
        )}
      >
        {formatValue(kpi)}
      </div>
      {unit ? <div className="mt-1 text-xs text-slate-500">{unit}</div> : null}
      {hasDelta ? (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
          )}
        >
          {up ? <TrendingUp className="h-3.5 w-3.5" aria-hidden /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden />}
          {formatFaPercent(Math.abs(kpi.deltaPercent!))}
        </div>
      ) : null}
      {kpi.hint ? <p className="mt-2 text-xs leading-4 text-slate-500">{kpi.hint}</p> : null}
      <p className="mt-2 text-xs text-slate-400">جزئیات ←</p>
    </button>
  );
}
