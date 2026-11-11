export type PeriodKey = "30d" | "90d" | "ytd" | "all";

export type AnalyticsQueryFilters = {
  period: PeriodKey;
  /** Didban SubjectClassId; null = all classes */
  subjectClassId: number | null;
};

export const DEFAULT_FILTERS: AnalyticsQueryFilters = {
  period: "all",
  subjectClassId: null,
};

/** Confirmed in docs/04 + inspection: شکایت = 1. Other class IDs left unset until confirmed. */
export const SUBJECT_CLASS_OPTIONS: { value: string; label: string; id: number | null }[] = [
  { value: "all", label: "همه طبقات", id: null },
  { value: "complaint", label: "شکایت", id: 1 },
];

export function periodToRange(period: PeriodKey): { from?: string; to?: string; label: string } {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  if (period === "all") {
    return { label: "کل دوره تاریخی" };
  }

  if (period === "ytd") {
    const from = new Date(today.getFullYear(), 0, 1);
    return { from: iso(from), to: iso(today), label: "از ابتدای سال میلادی تا امروز" };
  }

  const days = period === "30d" ? 30 : 90;
  const from = new Date(today);
  from.setDate(from.getDate() - days);
  return {
    from: iso(from),
    to: iso(today),
    label: period === "30d" ? "۳۰ روز اخیر" : "۹۰ روز اخیر",
  };
}

export function filtersToQuery(filters: AnalyticsQueryFilters): string {
  const params = new URLSearchParams();
  const range = periodToRange(filters.period);
  if (range.from) params.set("from", range.from);
  if (range.to) params.set("to", range.to);
  if (filters.subjectClassId != null) {
    params.set("subjectClassId", String(filters.subjectClassId));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function filtersKey(filters: AnalyticsQueryFilters): string {
  return `${filters.period}|${filters.subjectClassId ?? "all"}`;
}
