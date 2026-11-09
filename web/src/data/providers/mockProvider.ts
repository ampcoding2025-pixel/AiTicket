import { mockExecutiveDashboard } from "@/data/mock/executive";
import type { AnalyticsDataProvider, ExecutiveDashboardData } from "@/data/providers/types";

export const mockAnalyticsProvider: AnalyticsDataProvider = {
  async getExecutiveDashboard(): Promise<ExecutiveDashboardData> {
    // Simulate lightweight latency so UI can later swap to network calls cleanly.
    await new Promise((r) => setTimeout(r, 120));
    return mockExecutiveDashboard;
  },
};

export function getAnalyticsProvider(): AnalyticsDataProvider {
  // Future: switch via env NEXT_PUBLIC_DATA_PROVIDER=api
  return mockAnalyticsProvider;
}
