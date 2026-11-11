"use client";

import { useEffect, useState } from "react";
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
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const merged: EChartsOption = {
    ...option,
    animation: reduceMotion ? false : option.animation !== false,
  };

  return (
    <div role="img" aria-label={label}>
      <ReactECharts
        option={merged}
        style={{ height, width: "100%" }}
        opts={{ renderer: "canvas" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
