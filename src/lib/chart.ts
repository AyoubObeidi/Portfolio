export interface ChartPoint {
  // Short x-axis label, e.g. "Oct 6" or "14:00".
  label: string;
  // Longer label for the tooltip and table, e.g. "Mon, Oct 6".
  title: string;
  visitors: number;
  pageviews: number;
}

// Page views first so the larger series is drawn underneath.
export const SERIES = [
  {
    key: "pageviews",
    label: "Page views",
    stroke: "stroke-chart-pageviews",
    text: "text-chart-pageviews",
    bg: "bg-chart-pageviews",
  },
  {
    key: "visitors",
    label: "Visitors",
    stroke: "stroke-chart-visitors",
    text: "text-chart-visitors",
    bg: "bg-chart-visitors",
  },
] as const;

// Round axis steps (1, 2, 2.5, 5 × 10ⁿ) so tick labels read naturally.
export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ??
    10 * magnitude;
  const ticks = Math.max(1, Math.ceil(max / step));
  return Array.from({ length: ticks + 1 }, (_, i) =>
    Math.round(i * step * 100) / 100,
  );
}

export function xAt(index: number, length: number, width: number) {
  return length > 1 ? (index / (length - 1)) * width : width / 2;
}

export function linePath(
  values: number[],
  max: number,
  width: number,
  height: number,
) {
  return values
    .map((value, i) => {
      const x = xAt(i, values.length, width);
      const y = height - (value / max) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function areaPath(
  values: number[],
  max: number,
  width: number,
  height: number,
) {
  const last = xAt(values.length - 1, values.length, width).toFixed(1);
  const first = xAt(0, values.length, width).toFixed(1);
  return `${linePath(values, max, width, height)} L${last},${height} L${first},${height} Z`;
}
