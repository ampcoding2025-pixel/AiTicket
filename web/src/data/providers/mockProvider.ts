import { mockAdminCenter } from "@/data/mock/admin";
import { mockAiPerformance } from "@/data/mock/aiPerformance";
import { mockAnswerIntelligence } from "@/data/mock/answers";
import { mockCategoryExplorer } from "@/data/mock/categories";
import { mockExecutiveDashboard } from "@/data/mock/executive";
import { mockKpiMonitoring } from "@/data/mock/kpiCatalog";
import { mockReportsCenter } from "@/data/mock/reports";
import { mockRequestAnalytics } from "@/data/mock/requests";
import { mockTopicExplorer } from "@/data/mock/topics";
import type { AnalyticsQueryFilters } from "@/data/filters";
import type {
  AdminCenterData,
  AiPerformanceData,
  AnalyticsDataProvider,
  AnswerIntelligenceData,
  CategoryExplorerData,
  ExecutiveDashboardData,
  KpiMonitoringData,
  ReportsCenterData,
  RequestAnalyticsData,
  TopicExplorerData,
} from "@/data/providers/types";

export const mockAnalyticsProvider: AnalyticsDataProvider = {
  async getExecutiveDashboard(_filters?: AnalyticsQueryFilters): Promise<ExecutiveDashboardData> {
    await new Promise((r) => setTimeout(r, 120));
    return {
      ...mockExecutiveDashboard,
      bigIdea:
        "نسخه نمایشی: حجم و پوشش دانش برای طراحی UI است — برای تصمیم عملیاتی به حالت API وصل شوید.",
      emergingTopics: mockExecutiveDashboard.emergingTopics.map((t) => ({
        ...t,
        growthPercent: null,
      })),
    };
  },
  async getRequestAnalytics(_filters?: AnalyticsQueryFilters): Promise<RequestAnalyticsData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockRequestAnalytics;
  },
  async getCategoryExplorer(_filters?: AnalyticsQueryFilters): Promise<CategoryExplorerData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockCategoryExplorer;
  },
  async getTopicExplorer(_filters?: AnalyticsQueryFilters): Promise<TopicExplorerData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockTopicExplorer;
  },
  async getAnswerIntelligence(_filters?: AnalyticsQueryFilters): Promise<AnswerIntelligenceData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockAnswerIntelligence;
  },
  async getKpiMonitoring(_filters?: AnalyticsQueryFilters): Promise<KpiMonitoringData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockKpiMonitoring;
  },
  async getReportsCenter(): Promise<ReportsCenterData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockReportsCenter;
  },
  async getAiPerformance(): Promise<AiPerformanceData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockAiPerformance;
  },
  async getAdminCenter(): Promise<AdminCenterData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockAdminCenter;
  },
};
