import type {
  AnalyticsDataProvider,
  AnswerIntelligenceData,
  AnswerValidityStatus,
  CategoryExplorerData,
  CategoryNode,
  DictionaryFeasibility,
  ExecutiveDashboardData,
  ExecutiveKpi,
  KpiDictionaryItem,
  KpiFeasibility,
  KpiMonitoringData,
  KpiTone,
  NamedValue,
  RequestAnalyticsData,
  TaxonomyLevel,
  TopicExplorerData,
} from "@/data/providers/types";
import { mockAnalyticsProvider } from "@/data/providers/mockProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5088";

type ApiKpi = {
  id: string;
  label: string;
  value: number | null;
  unit?: string | null;
  deltaPercent?: number | null;
  tone?: string | null;
  hint?: string | null;
  feasibility: string;
};

type ApiMeta = {
  source: string;
  generatedAt: string;
  periodLabel: string;
  warnings?: string[] | null;
};

type ApiNamed = { name: string; value: number };

type ApiVolumePoint = { label: string; requests: number; complaints: number };

type ApiExecutive = {
  meta: ApiMeta;
  ruleSetVersion: string;
  kpis: ApiKpi[];
  volumeTrend?: ApiVolumePoint[] | null;
  classDistribution: ApiNamed[];
  channelDistribution: ApiNamed[];
  topSubjects: ApiNamed[];
  topDepartments: ApiNamed[];
  answerCoverage: {
    historicalAvailablePercent: number;
    currentlyValidPercent: number | null;
    needsReviewPercent: number | null;
    validityStatus: string;
    caveat: string;
  };
};

type ApiRequests = {
  meta: ApiMeta;
  ruleSetVersion: string;
  summary: ApiKpi[];
  byClass: ApiNamed[];
  byChannel: ApiNamed[];
  byRegion: ApiNamed[];
  bySubjectGroup: ApiNamed[];
};

type ApiCategoryNode = {
  id: string;
  level: string;
  name: string;
  count: number;
  growthPercent: number;
  complaintSharePercent?: number | null;
  samples?: { id: string; caption: string; className: string; status: string }[] | null;
  children?: ApiCategoryNode[] | null;
};

type ApiCategory = {
  meta: ApiMeta;
  ruleSetVersion: string;
  note: string;
  summary: ApiKpi[];
  tree: ApiCategoryNode[];
};

type ApiAnswers = {
  meta: ApiMeta;
  ruleSetVersion: string;
  caveat: string;
  summary: ApiKpi[];
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
    validity: string;
  }[];
  cases: {
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
    validity: string;
    validityNote: string;
  }[];
};

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${path} failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<T>;
}

function mapKpi(k: ApiKpi): ExecutiveKpi {
  return {
    id: k.id,
    label: k.label,
    value: k.value,
    unit: (k.unit as ExecutiveKpi["unit"]) ?? undefined,
    deltaPercent: k.deltaPercent ?? undefined,
    tone: (k.tone as KpiTone) ?? undefined,
    hint: k.hint ?? undefined,
    feasibility: k.feasibility as KpiFeasibility,
  };
}

function mapNamed(rows: ApiNamed[]): NamedValue[] {
  return rows.map((r) => ({ name: r.name, value: Number(r.value) }));
}

function mapCategoryNode(node: ApiCategoryNode): CategoryNode {
  return {
    id: node.id,
    level: node.level as TaxonomyLevel,
    name: node.name,
    count: Number(node.count),
    growthPercent: Number(node.growthPercent ?? 0),
    complaintSharePercent: node.complaintSharePercent ?? undefined,
    samples: node.samples?.map((s) => ({
      id: s.id,
      caption: s.caption,
      className: s.className,
      status: s.status,
    })),
    children: node.children?.map(mapCategoryNode),
  };
}

export const apiAnalyticsProvider: AnalyticsDataProvider = {
  async getExecutiveDashboard(): Promise<ExecutiveDashboardData> {
    const data = await fetchJson<ApiExecutive>("/api/v1/analytics/executive");
    const subjects = mapNamed(data.topSubjects);

    return {
      meta: {
        source: "didban",
        label: `داده زنده دیده‌بان · ruleSet ${data.ruleSetVersion}`,
        periodLabel: data.meta.periodLabel,
        generatedAt: data.meta.generatedAt,
        domainNote: "موجودیت Cookie · SubjectClass/Subject/Department — فقط‌خواندنی",
      },
      kpis: data.kpis.map(mapKpi),
      volumeTrend: (data.volumeTrend ?? []).map((p) => ({
        label: p.label,
        requests: Number(p.requests),
        complaints: Number(p.complaints),
      })),
      categoryDistribution: subjects.slice(0, 7),
      classDistribution: mapNamed(data.classDistribution),
      orgUnitPerformance: mapNamed(data.topDepartments),
      resolutionStatus: data.kpis
        .filter((k) => k.id === "resolved" || k.id === "unresolved")
        .map((k) => ({
          name: k.label,
          value: Number(k.value ?? 0),
        })),
      channelDistribution: mapNamed(data.channelDistribution),
      answerCoverage: {
        historicalAvailablePercent: data.answerCoverage.historicalAvailablePercent,
        currentlyValidPercent: data.answerCoverage.currentlyValidPercent,
        needsReviewPercent: data.answerCoverage.needsReviewPercent,
        validityStatus:
          data.answerCoverage.validityStatus === "unavailable"
            ? "unavailable"
            : "estimated",
        caveat: data.answerCoverage.caveat,
      },
      emergingTopics: subjects.slice(0, 5).map((s, idx) => ({
        rank: idx + 1,
        topic: s.name,
        count: s.value,
        growthPercent: 0,
      })),
      insights: [
        {
          id: "live-1",
          title: "اتصال زنده به دیده‌بان فعال است",
          body: `شاخص‌های حجم و پوشش پاسخ از پایگاه خوانده شدند (${data.meta.periodLabel}).`,
          severity: "info",
        },
        {
          id: "live-2",
          title: "اعتبار پاسخ تاریخی ناموجود",
          body: "پوشش پاسخ فقط Availability است؛ Validity تا لایه دانش نسخه‌بندی خاموش می‌ماند.",
          severity: "attention",
        },
      ],
    };
  },

  async getRequestAnalytics(): Promise<RequestAnalyticsData> {
    const data = await fetchJson<ApiRequests>("/api/v1/analytics/requests");
    return {
      meta: {
        source: "didban",
        label: `تحلیل درخواست زنده · ${data.ruleSetVersion}`,
        periodLabel: data.meta.periodLabel,
      },
      summary: data.summary.map(mapKpi),
      byClass: mapNamed(data.byClass),
      bySubjectGroup: mapNamed(data.bySubjectGroup),
      byChannel: mapNamed(data.byChannel),
      byRegion: mapNamed(data.byRegion),
      periodComparison: data.byClass.map((row) => ({
        label: row.name,
        current: Number(row.value),
        previous: Number(row.value),
      })),
      repeatedCandidates: [
        {
          id: "live-proxy",
          subject: "تشخیص تکرار متنی هنوز در API نیست",
          count: 0,
          method: "pending",
          note: "ReferringCookieId ضعیف است؛ شباهت در فاز بعد",
        },
      ],
    };
  },

  async getCategoryExplorer(): Promise<CategoryExplorerData> {
    const data = await fetchJson<ApiCategory>("/api/v1/analytics/categories/tree");
    return {
      meta: {
        source: "didban",
        label: `کاوش دسته‌بندی زنده · ${data.ruleSetVersion}`,
        periodLabel: data.meta.periodLabel,
        note: data.note,
      },
      summary: data.summary.map(mapKpi),
      tree: data.tree.map(mapCategoryNode),
    };
  },

  async getAnswerIntelligence(): Promise<AnswerIntelligenceData> {
    const data = await fetchJson<ApiAnswers>("/api/v1/knowledge/answers/summary");
    return {
      meta: {
        source: "didban",
        label: `هوش پاسخ تاریخی زنده · ${data.ruleSetVersion}`,
        periodLabel: data.meta.periodLabel,
        caveat: data.caveat,
      },
      summary: data.summary.map(mapKpi),
      coverageBreakdown: {
        totalEligible: Number(data.coverageBreakdown.totalEligible),
        withCitizenReply: Number(data.coverageBreakdown.withCitizenReply),
        withOperatorNoteOnly: Number(data.coverageBreakdown.withOperatorNoteOnly),
        withNoTextAnswer: Number(data.coverageBreakdown.withNoTextAnswer),
        currentlyValid: data.coverageBreakdown.currentlyValid,
        needsReview: data.coverageBreakdown.needsReview,
      },
      coverageTrend: data.coverageTrend.map((t) => ({
        label: t.label,
        availablePercent: Number(t.availablePercent),
      })),
      frequentAnswers: data.frequentAnswers.map((f) => ({
        id: f.id,
        topic: f.topic,
        reuseCount: Number(f.reuseCount),
        lastUsed: f.lastUsed,
        validity: f.validity as AnswerValidityStatus,
      })),
      cases: data.cases.map((c) => ({
        id: c.id,
        requestCaption: c.requestCaption,
        requestClass: c.requestClass,
        subjectName: c.subjectName,
        departmentName: c.departmentName,
        requestDate: c.requestDate,
        answerDate: c.answerDate,
        answerExcerpt: c.answerExcerpt,
        similarityScore: c.similarityScore,
        similarCaseId: c.similarCaseId,
        validity: c.validity as AnswerValidityStatus,
        validityNote: c.validityNote,
      })),
    };
  },

  async getTopicExplorer(): Promise<TopicExplorerData> {
    const data = await fetchJson<{
      meta: ApiMeta;
      ruleSetVersion: string;
      method: string;
      caveat: string;
      summary: ApiKpi[];
      clusters: {
        id: string;
        name: string;
        size: number;
        sharePercent: number;
        growthPercent: number | null;
        coherence: number | null;
        method: string;
        keywords: string[];
        linkedSubjectNames: string[];
        evolution: { label: string; count: number }[];
        samples: { id: string; caption: string; className: string }[];
      }[];
      relations: { source: string; target: string; weight: number; reason: string }[];
    }>("/api/v1/analytics/topics");

    return {
      meta: {
        source: "didban",
        label: `کاوش موضوع · ${data.method} · ${data.ruleSetVersion}`,
        periodLabel: data.meta.periodLabel,
        modelStatus: "taxonomy_baseline",
        caveat: data.caveat,
      },
      summary: data.summary.map(mapKpi),
      clusters: data.clusters.map((c) => ({
        id: c.id,
        name: c.name,
        size: Number(c.size),
        sharePercent: Number(c.sharePercent),
        growthPercent: Number(c.growthPercent ?? 0),
        coherence: Number(c.coherence ?? 0),
        method: c.method,
        keywords: c.keywords ?? [],
        linkedSubjectNames: c.linkedSubjectNames ?? [],
        evolution: (c.evolution ?? []).map((e) => ({
          label: e.label,
          count: Number(e.count),
        })),
        samples: (c.samples ?? []).map((s) => ({
          id: s.id,
          caption: s.caption,
          className: s.className,
        })),
      })),
      relations: (data.relations ?? []).map((r) => ({
        source: r.source,
        target: r.target,
        weight: Number(r.weight),
        reason: r.reason,
      })),
    };
  },

  async getKpiMonitoring(): Promise<KpiMonitoringData> {
    const catalog = await mockAnalyticsProvider.getKpiMonitoring();
    const live = await fetchJson<{
      meta: ApiMeta;
      ruleSetVersion: string;
      values: {
        code: string;
        feasibility: string;
        value: number | null;
        unit: string;
        computedAt: string;
      }[];
    }>("/api/v1/kpis/values");

    const byCode = new Map(
      live.values.map((v) => [v.code.trim().toUpperCase(), v] as const),
    );

    const items: KpiDictionaryItem[] = catalog.items.map((item) => {
      const hit = byCode.get(item.code.toUpperCase());
      if (!hit) {
        return {
          ...item,
          latestValue: null,
          trend: [],
        };
      }

      const unit =
        hit.unit === "percent" || hit.unit === "days" || hit.unit === "ratio"
          ? hit.unit
          : item.unit;

      const feasibility = (
        ["feasible", "needs_rules", "weak_proxy", "unavailable", "planned_m2"].includes(
          hit.feasibility,
        )
          ? hit.feasibility
          : item.feasibility
      ) as DictionaryFeasibility;

      return {
        ...item,
        feasibility,
        latestValue: hit.value,
        unit,
        trend:
          hit.value == null
            ? []
            : [{ label: live.meta.periodLabel || "جاری", value: Number(hit.value) }],
      };
    });

    const counts: Record<DictionaryFeasibility, number> = {
      feasible: 0,
      needs_rules: 0,
      weak_proxy: 0,
      unavailable: 0,
      planned_m2: 0,
    };
    for (const item of items) {
      counts[item.feasibility] += 1;
    }

    const liveCodes = live.values.map((v) => v.code).join("، ");

    return {
      meta: {
        source: "didban",
        label: `پایش شاخص‌ها · داده زنده (${live.ruleSetVersion})`,
        periodLabel: live.meta.periodLabel,
        note: `مقادیر زنده برای ${liveCodes}. سایر کدهای کاتالوگ فقط تعریف/امکان‌سنجی دارند و عدد Mock نمایش داده نمی‌شود.`,
      },
      counts,
      items,
    };
  },

  getReportsCenter: () => mockAnalyticsProvider.getReportsCenter(),
  getAiPerformance: () => mockAnalyticsProvider.getAiPerformance(),
  getAdminCenter: () => mockAnalyticsProvider.getAdminCenter(),
};
