export type KpiTone = "neutral" | "positive" | "warning" | "critical";

export type ExecutiveKpi = {
  id: string;
  label: string;
  value: number;
  unit?: "count" | "percent" | "days";
  deltaPercent?: number;
  tone?: KpiTone;
  hint?: string;
};

export type TimePoint = { label: string; requests: number; complaints: number };

export type NamedValue = { name: string; value: number };

export type Insight = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "attention" | "opportunity";
};

export type ExecutiveDashboardData = {
  meta: {
    source: "mock";
    label: string;
    periodLabel: string;
    generatedAt: string;
  };
  kpis: ExecutiveKpi[];
  volumeTrend: TimePoint[];
  categoryDistribution: NamedValue[];
  orgUnitPerformance: NamedValue[];
  resolutionStatus: NamedValue[];
  answerCoverage: {
    historicalAvailablePercent: number;
    currentlyValidPercent: number;
    needsReviewPercent: number;
    caveat: string;
  };
  emergingTopics: { rank: number; topic: string; count: number; growthPercent: number }[];
  insights: Insight[];
};

export interface AnalyticsDataProvider {
  getExecutiveDashboard(): Promise<ExecutiveDashboardData>;
}
