"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { useChartTitle } from "@/components/dashboard/ChartCard";

export function EChart({
  option,
  height = 280,
  ariaLabel,
}: {
  option: EChartsOption;
  height?: number;
  /** Accessible name; defaults to parent ChartCard title when present */
  ariaLabel?: string;
}) {
  const chartTitle = useChartTitle();
  const label = ariaLabel ?? chartTitle ?? "نمودار تحلیلی";

  return (
    <div role="img" aria-label={label}>
      <ReactECharts
        option={option}
        style={{ height, width: "100%" }}
        opts={{ renderer: "canvas" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
