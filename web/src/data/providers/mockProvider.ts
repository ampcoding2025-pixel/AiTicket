import { mockAdminCenter } from "@/data/mock/admin";
import { mockAiPerformance } from "@/data/mock/aiPerformance";
import { mockAnswerIntelligence } from "@/data/mock/answers";
import { mockCategoryExplorer } from "@/data/mock/categories";
import { mockExecutiveDashboard } from "@/data/mock/executive";
import { mockKpiMonitoring } from "@/data/mock/kpiCatalog";
import { mockReportsCenter } from "@/data/mock/reports";
import { mockRequestAnalytics } from "@/data/mock/requests";
import { mockTopicExplorer } from "@/data/mock/topics";
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
  async getExecutiveDashboard(): Promise<ExecutiveDashboardData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockExecutiveDashboard;
  },
  async getRequestAnalytics(): Promise<RequestAnalyticsData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockRequestAnalytics;
  },
  async getCategoryExplorer(): Promise<CategoryExplorerData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockCategoryExplorer;
  },
  async getTopicExplorer(): Promise<TopicExplorerData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockTopicExplorer;
  },
  async getAnswerIntelligence(): Promise<AnswerIntelligenceData> {
    await new Promise((r) => setTimeout(r, 120));
    return mockAnswerIntelligence;
  },
  async getKpiMonitoring(): Promise<KpiMonitoringData> {
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

