import type { ReactNode } from "react";
import { RANGES, type RangeKey, type SeriesPoint } from "@/lib/analytics";
import { niceTicks, SERIES, type ChartPoint } from "@/lib/chart";
import { cn } from "@/lib/utils";
import { TrafficChart } from "@/components/animation/TrafficChart";
import { Panel } from "@/components/ui/Panel";
import { RangeTabs } from "./RangeTabs";

interface TrafficPanelProps {
  range: RangeKey;
  // Omitted while there's nothing to chart; children explain why.
  series?: SeriesPoint[];
  children?: ReactNode;
}

export const TRAFFIC_HEADING_ID = "traffic";

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options });
const DAY_LABEL = fmt({ month: "short", day: "numeric" });
const DAY_TITLE = fmt({ weekday: "short", month: "short", day: "numeric" });
const HOUR_LABEL = fmt({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

// Formatted on the server, in UTC, so labels match the API's buckets and hydrate cleanly.
function toChartPoints(range: RangeKey, series: SeriesPoint[]): ChartPoint[] {
  const hourly = RANGES[range].by === "hour";
  return series.map(({ timestamp, visitors, pageviews }) => {
    const date = new Date(timestamp);
    return {
      label: hourly ? HOUR_LABEL.format(date) : DAY_LABEL.format(date),
      title: hourly
        ? `${DAY_LABEL.format(date)}, ${HOUR_LABEL.format(date)} UTC`
        : DAY_TITLE.format(date),
      visitors,
      pageviews,
    };
  });
}

export function TrafficPanel({ range, series, children }: TrafficPanelProps) {
  const points = series ? toChartPoints(range, series) : [];
  const ticks = niceTicks(Math.max(0, ...points.map((p) => p.pageviews)));

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-border pb-3">
        <h2 id={TRAFFIC_HEADING_ID} className="text-meta font-medium">
          Traffic, {RANGES[range].name}
        </h2>
        <RangeTabs active={range} />
      </div>

      {children}

      {points.length > 0 && (
        <>
          <ul
            aria-hidden="true"
            className="mt-3 mb-4 flex justify-end gap-4 text-2xs text-fg-muted"
          >
            {[...SERIES].reverse().map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className={cn("size-2 rounded-xs", s.bg)} />
                {s.label}
              </li>
            ))}
          </ul>

          <TrafficChart points={points} ticks={ticks} />

          {/* sr-only goes on a wrapper: tables ignore its 1px size and would add page height. */}
          <div className="sr-only">
            <table>
              <caption>Visitors and page views, {RANGES[range].name}</caption>
              <thead>
                <tr>
                  <th scope="col">{RANGES[range].by === "hour" ? "Hour" : "Day"}</th>
                  <th scope="col">Visitors</th>
                  <th scope="col">Page views</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr key={p.title}>
                    <th scope="row">{p.title}</th>
                    <td>{p.visitors}</td>
                    <td>{p.pageviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Panel>
  );
}
