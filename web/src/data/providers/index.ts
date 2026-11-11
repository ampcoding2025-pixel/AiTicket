import { apiAnalyticsProvider } from "@/data/providers/apiProvider";
import { mockAnalyticsProvider } from "@/data/providers/mockProvider";
import type { AnalyticsDataProvider } from "@/data/providers/types";

export function getAnalyticsProvider(): AnalyticsDataProvider {
  const mode = process.env.NEXT_PUBLIC_DATA_PROVIDER ?? "mock";
  return mode === "api" ? apiAnalyticsProvider : mockAnalyticsProvider;
}

export { mockAnalyticsProvider, apiAnalyticsProvider };
