"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_FILTERS,
  type AnalyticsQueryFilters,
  type PeriodKey,
} from "@/data/filters";

type DashboardFilterContextValue = {
  filters: AnalyticsQueryFilters;
  setPeriod: (period: PeriodKey) => void;
  setSubjectClassId: (id: number | null) => void;
  resetFilters: () => void;
  isDefaultFilters: boolean;
};

const DashboardFilterContext = createContext<DashboardFilterContextValue | null>(null);

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<AnalyticsQueryFilters>(DEFAULT_FILTERS);

  const value = useMemo<DashboardFilterContextValue>(
    () => ({
      filters,
      setPeriod: (period) => setFilters((prev) => ({ ...prev, period })),
      setSubjectClassId: (subjectClassId) =>
        setFilters((prev) => ({ ...prev, subjectClassId })),
      resetFilters: () => setFilters(DEFAULT_FILTERS),
      isDefaultFilters:
        filters.period === DEFAULT_FILTERS.period &&
        filters.subjectClassId === DEFAULT_FILTERS.subjectClassId,
    }),
    [filters],
  );

  return (
    <DashboardFilterContext.Provider value={value}>{children}</DashboardFilterContext.Provider>
  );
}

export function useDashboardFilters(): DashboardFilterContextValue {
  const ctx = useContext(DashboardFilterContext);
  if (!ctx) {
    throw new Error("useDashboardFilters must be used within DashboardFilterProvider");
  }
  return ctx;
}
