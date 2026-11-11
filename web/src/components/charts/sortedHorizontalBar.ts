import type { EChartsOption } from "echarts";
import { formatFaNumber } from "@/lib/utils";

const brand = "#0f766e";
const slate = "#64748b";
const amber = "#d97706";

export type NamedBar = { name: string; value: number };

/**
 * Shared Ch.9 / executive pattern: sorted horizontal bars, optional max highlight.
 * Ascending sort so the largest category sits at the top of the category axis.
 */
export function sortedHorizontalBarOption(
  rows: NamedBar[],
  opts?: {
    labelWidth?: number;
    barWidth?: number;
    highlightMax?: boolean;
    color?: string;
  },
): EChartsOption {
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  const labelWidth = opts?.labelWidth ?? 130;
  const highlightMax = opts?.highlightMax !== false;
  const baseColor = opts?.color ?? brand;
  const maxValue = sorted.length ? Math.max(...sorted.map((r) => r.value)) : 0;

  return {
    textStyle: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (v) => formatFaNumber(Number(v)),
    },
    grid: { left: labelWidth + 12, right: 48, top: 8, bottom: 20 },
    xAxis: {
      type: "value",
      min: 0,
      axisLabel: { color: slate },
      splitLine: { lineStyle: { color: "#eef2f7" } },
    },
    yAxis: {
      type: "category",
      data: sorted.map((r) => r.name),
      axisLabel: { color: slate, width: labelWidth, overflow: "truncate" },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        barWidth: opts?.barWidth ?? 12,
        data: sorted.map((r) => ({
          value: r.value,
          itemStyle: {
            color: highlightMax && r.value === maxValue && maxValue > 0 ? amber : baseColor,
          },
        })),
        label: {
          show: true,
          position: "right",
          color: slate,
          fontSize: 11,
          formatter: (p: { value?: number | number[] }) => {
            const v = Array.isArray(p.value) ? Number(p.value[0]) : Number(p.value);
            if (!highlightMax || !Number.isFinite(v) || v !== maxValue || maxValue <= 0) {
              return "";
            }
            return formatFaNumber(v);
          },
        },
      },
    ],
  };
}
