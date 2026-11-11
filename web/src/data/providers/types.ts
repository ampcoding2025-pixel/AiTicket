export type KpiTone = "neutral" | "positive" | "warning" | "critical";

/** Feasibility vs Didban field inspection — drives honest UI badges. */
export type KpiFeasibility =
  | "feasible"
  | "needs_rules"
  | "unavailable"
  | "illustrative";

export type ExecutiveKpi = {
  id: string;
  label: string;
  value: number;
  unit?: "count" | "percent" | "days";
  deltaPercent?: number;
  tone?: KpiTone;
  hint?: string;
  feasibility?: KpiFeasibility;
};

export type TimePoint = { label: string; requests: number; complaints: number };

export type NamedValue = { name: string; value: number };

export type Insight = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "attention" | "opportunity";
};

export type AnswerCoverage = {
  /** Share of cases with non-empty CookieFlowReplyCitizen (availability only). */
  historicalAvailablePercent: number;
  /** Null when regulation/version validity model does not exist in Didban. */
  currentlyValidPercent: number | null;
  needsReviewPercent: number | null;
  validityStatus: "unavailable" | "estimated" | "measured";
  caveat: string;
};

export type ExecutiveDashboardData = {
  meta: {
    source: "mock";
    label: string;
    periodLabel: string;
    generatedAt: string;
    domainNote: string;
  };
  kpis: ExecutiveKpi[];
  volumeTrend: TimePoint[];
  categoryDistribution: NamedValue[];
  classDistribution: NamedValue[];
  orgUnitPerformance: NamedValue[];
  resolutionStatus: NamedValue[];
  channelDistribution: NamedValue[];
  answerCoverage: AnswerCoverage;
  emergingTopics: { rank: number; topic: string; count: number; growthPercent: number }[];
  insights: Insight[];
};

export type RequestAnalyticsData = {
  meta: {
    source: "mock";
    label: string;
    periodLabel: string;
  };
  summary: ExecutiveKpi[];
  byClass: NamedValue[];
  bySubjectGroup: NamedValue[];
  byChannel: NamedValue[];
  byRegion: NamedValue[];
  periodComparison: { label: string; current: number; previous: number }[];
  repeatedCandidates: {
    id: string;
    subject: string;
    count: number;
    method: string;
    note: string;
  }[];
};

export type TaxonomyLevel = "zone" | "nature" | "group" | "subject";

export type CategorySample = {
  id: string;
  caption: string;
  className: string;
  status: string;
};

export type CategoryNode = {
  id: string;
  level: TaxonomyLevel;
  name: string;
  count: number;
  growthPercent: number;
  complaintSharePercent?: number;
  samples?: CategorySample[];
  children?: CategoryNode[];
};

export type CategoryExplorerData = {
  meta: {
    source: "mock";
    label: string;
    periodLabel: string;
    note: string;
  };
  summary: ExecutiveKpi[];
  tree: CategoryNode[];
};

export type TopicSample = {
  id: string;
  caption: string;
  className: string;
};

export type TopicCluster = {
  id: string;
  name: string;
  size: number;
  sharePercent: number;
  growthPercent: number;
  coherence: number;
  method: string;
  keywords: string[];
  linkedSubjectNames: string[];
  evolution: { label: string; count: number }[];
  samples: TopicSample[];
};

export type TopicRelationEdge = {
  source: string;
  target: string;
  weight: number;
  reason: string;
};

export type TopicExplorerData = {
  meta: {
    source: "mock";
    label: string;
    periodLabel: string;
    modelStatus: "planned" | "offline_batch" | "production";
    caveat: string;
  };
  summary: ExecutiveKpi[];
  clusters: TopicCluster[];
  relations: TopicRelationEdge[];
};

export type AnswerValidityStatus =
  | "available_unvalidated"
  | "validity_unknown"
  | "needs_expert_review"
  | "no_answer";

export type HistoricalAnswerCase = {
  id: string;
  requestCaption: string;
  requestClass: string;
  subjectName: string;
  departmentName: string;
  requestDate: string;
  answerDate: string | null;
  answerExcerpt: string | null;
  similarityScore: number | null;
  similarCaseId: string | null;
  validity: AnswerValidityStatus;
  validityNote: string;
};

export type AnswerIntelligenceData = {
  meta: {
    source: "mock";
    label: string;
    periodLabel: string;
    caveat: string;
  };
  summary: ExecutiveKpi[];
  coverageBreakdown: {
    totalEligible: number;
    withCitizenReply: number;
    withOperatorNoteOnly: number;
    withNoTextAnswer: number;
    currentlyValid: number | null;
    needsReview: number | null;
  };
  coverageTrend: { label: string; availablePercent: number }[];
  frequentAnswers: {
    id: string;
    topic: string;
    reuseCount: number;
    lastUsed: string;
    validity: AnswerValidityStatus;
  }[];
  cases: HistoricalAnswerCase[];
};

export type KpiGroup = "volume" | "resolution" | "operational" | "knowledge" | "ai" | "cx";

export type DictionaryFeasibility =
  | "feasible"
  | "needs_rules"
  | "weak_proxy"
  | "unavailable"
  | "planned_m2";

export type KpiDictionaryItem = {
  id: string;
  code: string;
  group: KpiGroup;
  name: string;
  definition: string;
  formula: string;
  requiredFields: string[];
  aggregation: string;
  timeDimension: string;
  filters: string[];
  interpretation: string;
  limitations: string;
  feasibility: DictionaryFeasibility;
  latestValue: number | null;
  unit: "count" | "percent" | "days" | "ratio";
  trend: { label: string; value: number }[];
};

export type KpiMonitoringData = {
  meta: {
    source: "mock";
    label: string;
    periodLabel: string;
    note: string;
  };
  counts: Record<DictionaryFeasibility, number>;
  items: KpiDictionaryItem[];
};

export type ReportFormat = "pdf" | "xlsx";
export type ReportStatus = "ready_stub" | "needs_live_data" | "planned";

export type StandardReport = {
  id: string;
  name: string;
  description: string;
  category: "executive" | "category" | "unit" | "knowledge" | "period";
  formats: ReportFormat[];
  status: ReportStatus;
  lastGeneratedLabel: string;
  dependsOnKpis: string[];
};

export type ExportJob = {
  id: string;
  reportName: string;
  format: ReportFormat;
  requestedAt: string;
  status: "queued" | "done_stub" | "failed_stub";
  note: string;
};

export type ReportsCenterData = {
  meta: {
    source: "mock";
    label: string;
    note: string;
  };
  reports: StandardReport[];
  recentExports: ExportJob[];
};

export type AiMetricStatus = "not_measured" | "demo_placeholder" | "live";

export type AiMetricCard = {
  id: string;
  label: string;
  value: number | null;
  unit: "percent" | "count" | "ms" | "score";
  status: AiMetricStatus;
  hint: string;
};

export type AiPerformanceData = {
  meta: {
    source: "mock";
    label: string;
    modelName: string;
    modelVersion: string;
    lifecycle: "not_trained" | "offline_eval" | "shadow" | "production";
    caveat: string;
  };
  metrics: AiMetricCard[];
  confusionMatrix: {
    labels: string[];
    /** rows = actual, cols = predicted — demo placeholder only */
    matrix: number[][];
    status: AiMetricStatus;
  };
  confidenceBins: { label: string; count: number }[];
  driftSeries: { label: string; score: number | null }[];
  readinessChecklist: { id: string; label: string; done: boolean }[];
};

export type AdminRoleName =
  | "executive"
  | "analytics"
  | "supervisor"
  | "expert"
  | "admin";

export type AdminUser = {
  id: string;
  name: string;
  role: AdminRoleName;
  unit: string;
  status: "active" | "disabled";
  lastLoginLabel: string;
};

export type DataSourceItem = {
  id: string;
  name: string;
  engine: string;
  database: string;
  accessMode: "read_only" | "denied" | "unknown";
  status: "connected_stub" | "unreachable_stub" | "not_configured";
  note: string;
};

export type IntegrationCheck = {
  id: string;
  name: string;
  status: "ok_stub" | "warn_stub" | "fail_stub" | "pending";
  detail: string;
  checkedAt: string;
};

export type AuditLogItem = {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  result: "success" | "denied" | "error";
};

export type AdminSettings = {
  uiLanguage: string;
  defaultTheme: string;
  dataProvider: string;
  piiMasking: boolean;
  mockBanner: boolean;
  notes: string[];
};

export type AdminCenterData = {
  meta: {
    source: "mock";
    label: string;
    note: string;
  };
  users: AdminUser[];
  roles: { id: AdminRoleName; label: string; permissions: string[] }[];
  dataSources: DataSourceItem[];
  integrations: IntegrationCheck[];
  auditLogs: AuditLogItem[];
  settings: AdminSettings;
};

export interface AnalyticsDataProvider {
  getExecutiveDashboard(): Promise<ExecutiveDashboardData>;
  getRequestAnalytics(): Promise<RequestAnalyticsData>;
  getCategoryExplorer(): Promise<CategoryExplorerData>;
  getTopicExplorer(): Promise<TopicExplorerData>;
  getAnswerIntelligence(): Promise<AnswerIntelligenceData>;
  getKpiMonitoring(): Promise<KpiMonitoringData>;
  getReportsCenter(): Promise<ReportsCenterData>;
  getAiPerformance(): Promise<AiPerformanceData>;
  getAdminCenter(): Promise<AdminCenterData>;
}
