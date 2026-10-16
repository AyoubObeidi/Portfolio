import { cacheLife } from "next/cache";

// Server-only: reads VERCEL_* credentials. Import from server components only.

export const RANGES = {
  "24h": { label: "24H", name: "last 24 hours", hours: 24, by: "hour" },
  "7d": { label: "7D", name: "last 7 days", hours: 7 * 24, by: "day" },
  "30d": { label: "30D", name: "last 30 days", hours: 30 * 24, by: "day" },
} as const;

export type RangeKey = keyof typeof RANGES;
export const DEFAULT_RANGE: RangeKey = "7d";

export function parseRange(value: string | string[] | undefined): RangeKey {
  return typeof value === "string" && value in RANGES
    ? (value as RangeKey)
    : DEFAULT_RANGE;
}

export interface Totals {
  pageviews: number;
  visitors: number;
}

export interface SeriesPoint extends Totals {
  // ISO timestamp for the start of the hour or day (UTC).
  timestamp: string;
}

export interface TopItem {
  label: string;
  pageviews: number;
  visitors: number;
}

export interface TrafficReport {
  range: RangeKey;
  totals: Totals;
  // Null when there's nothing to compare against (no traffic in the previous period).
  previous: Totals | null;
  series: SeriesPoint[];
  topPages: TopItem[];
  referrers: TopItem[];
  countries: TopItem[];
  devices: TopItem[];
}

export type TrafficResult =
  | { status: "ok"; report: TrafficReport }
  | { status: "not-configured" }
  | { status: "error" };

interface CountResponse {
  data: Totals;
}

interface AggregateResponse {
  data: (Totals & Record<string, string | number | null>)[];
}

const API = "https://api.vercel.com/v1/query/web-analytics/visits";
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function credentials() {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return null;
  return { token, projectId, teamId: process.env.VERCEL_TEAM_ID };
}

type Credentials = NonNullable<ReturnType<typeof credentials>>;

async function query<T>(
  creds: Credentials,
  endpoint: "count" | "aggregate",
  params: Record<string, string>,
): Promise<T> {
  const search = new URLSearchParams({ projectId: creds.projectId, ...params });
  if (creds.teamId) search.set("teamId", creds.teamId);

  const res = await fetch(`${API}/${endpoint}?${search}`, {
    headers: { Authorization: `Bearer ${creds.token}` },
  });
  if (!res.ok) {
    throw new Error(`Vercel Web Analytics responded ${res.status} (${endpoint})`);
  }
  return (await res.json()) as T;
}

// One entry per hour or day in the window, so gaps show as zero rather than vanishing.
function fillSeries(
  rows: AggregateResponse["data"],
  since: number,
  count: number,
  step: number,
): SeriesPoint[] {
  const keyLength = step === HOUR ? 13 : 10; // "2026-10-14T09" or "2026-10-14"
  const byKey = new Map(
    rows.map((row) => [String(row.timestamp).slice(0, keyLength), row]),
  );
  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(since + i * step).toISOString();
    const row = byKey.get(timestamp.slice(0, keyLength));
    return {
      timestamp,
      pageviews: row?.pageviews ?? 0,
      visitors: row?.visitors ?? 0,
    };
  });
}

function toTopItems(
  rows: AggregateResponse["data"],
  dimension: string,
  labelFor: (value: string) => string = (value) => value,
): TopItem[] {
  return rows
    .filter((row) => row[dimension] !== "Others")
    .map((row) => ({
      label: labelFor(String(row[dimension] ?? "")),
      pageviews: row.pageviews,
      visitors: row.visitors,
    }));
}

const REGIONS = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string) {
  if (!code) return "Unknown";
  try {
    return REGIONS.of(code) ?? code;
  } catch {
    return code;
  }
}

function capitalize(value: string) {
  return value ? value[0].toUpperCase() + value.slice(1) : "Unknown";
}

// Cached for 30 minutes so page views don't hit the API (or its rate limits) on every request.
export async function getTraffic(range: RangeKey): Promise<TrafficResult> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 1800, expire: 86_400 });

  const creds = credentials();
  if (!creds) {
    cacheLife("minutes");
    return { status: "not-configured" };
  }

  const { hours, by } = RANGES[range];
  const step = by === "hour" ? HOUR : DAY;
  const count = by === "hour" ? hours : hours / 24;
  // Align the window to whole hours or days so buckets line up with the API's.
  const now = Date.now();
  const until = now;
  const since = Math.floor(now / step) * step - (count - 1) * step;
  const previousSince = since - count * step;

  const window = { since: String(since), until: String(until) };
  const top = (dimension: string, limit: number) =>
    query<AggregateResponse>(creds, "aggregate", {
      ...window,
      by: dimension,
      limit: String(limit),
    });

  try {
    const [totals, previous, series, pages, referrers, countries, devices] =
      await Promise.all([
        query<CountResponse>(creds, "count", window),
        // Optional: the Hobby plan only keeps 31 days, so the period before 30D is out of reach.
        query<CountResponse>(creds, "count", {
          since: String(previousSince),
          until: String(since - 1),
        }).catch(() => null),
        query<AggregateResponse>(creds, "aggregate", { ...window, by }),
        top("requestPath", 5),
        top("referrerHostname", 5),
        top("country", 5),
        top("deviceType", 3),
      ]);

    return {
      status: "ok",
      report: {
        range,
        totals: totals.data,
        previous:
          previous && previous.data.pageviews > 0 ? previous.data : null,
        series: fillSeries(series.data, since, count, step),
        topPages: toTopItems(pages.data, "requestPath"),
        referrers: toTopItems(
          referrers.data,
          "referrerHostname",
          (host) => host || "Direct",
        ),
        countries: toTopItems(countries.data, "country", countryName),
        devices: toTopItems(devices.data, "deviceType", capitalize),
      },
    };
  } catch (error) {
    console.error("Failed to load Vercel Web Analytics:", error);
    cacheLife("minutes");
    return { status: "error" };
  }
}
