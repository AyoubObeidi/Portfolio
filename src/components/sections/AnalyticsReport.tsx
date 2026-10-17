import { getTraffic, parseRange, RANGES } from "@/lib/analytics";
import { StatTile } from "./StatTile";
import { TrafficPanel } from "./TrafficPanel";

interface AnalyticsReportProps {
  searchParams: PageProps<"/analytics">["searchParams"];
}

const MESSAGES = {
  "not-configured":
    "Stats aren't connected yet. Once the Vercel Web Analytics API is set up, real traffic for this site will show here.",
  error:
    "Couldn't reach Vercel Web Analytics right now, so there are no numbers to show. Try again in a few minutes.",
};

const NOTICE = "mt-4 max-w-[60ch] text-sm text-fg-muted";

export async function AnalyticsReport({ searchParams }: AnalyticsReportProps) {
  const range = parseRange((await searchParams).range);
  const result = await getTraffic(range);
  const periodName = RANGES[range].name.replace("last ", "");

  if (result.status !== "ok") {
    return (
      <TrafficPanel range={range}>
        <p className={NOTICE}>{MESSAGES[result.status]}</p>
      </TrafficPanel>
    );
  }

  const { totals, previous, series } = result.report;

  if (totals.pageviews === 0) {
    return (
      <TrafficPanel range={range}>
        <p className={NOTICE}>
          No visits recorded in the {RANGES[range].name} yet.
        </p>
      </TrafficPanel>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <StatTile
          label="Visitors"
          value={totals.visitors}
          previous={previous?.visitors ?? null}
          periodName={periodName}
        />
        <StatTile
          label="Page views"
          value={totals.pageviews}
          previous={previous?.pageviews ?? null}
          periodName={periodName}
        />
      </div>

      <TrafficPanel range={range} series={series} />
    </div>
  );
}
