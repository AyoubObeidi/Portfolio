import { cacheLife } from "next/cache";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface ContributionCalendar {
  total: number;
  weeks: ContributionDay[][];
}

interface CalendarResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
              contributionLevel: string;
            }[];
          }[];
        };
      };
    } | null;
  };
}

const LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

// Returns null when the token is missing or GitHub fails; failures are cached only briefly.
export async function getContributions(
  username: string,
): Promise<ContributionCalendar | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 43_200, expire: 86_400 });

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    cacheLife("minutes");
    return null;
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

    const json = (await res.json()) as CalendarResponse;
    const calendar =
      json.data?.user?.contributionsCollection.contributionCalendar;
    if (!calendar) throw new Error("No contribution calendar in response");

    return {
      total: calendar.totalContributions,
      weeks: calendar.weeks.map((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: LEVELS[day.contributionLevel] ?? 0,
        })),
      ),
    };
  } catch (error) {
    console.error("Failed to load GitHub contributions:", error);
    cacheLife("minutes");
    return null;
  }
}

const MONTH = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

function monthOf(date: string) {
  return MONTH.format(new Date(`${date}T00:00:00Z`));
}

// Label a week column when its first day starts a new month, skipping a cramped first label.
export function monthLabels(weeks: ContributionDay[][]): (string | null)[] {
  return weeks.map((week, i) => {
    const month = monthOf(week[0].date);
    if (i === 0) {
      const nextChange = weeks.findIndex((w) => monthOf(w[0].date) !== month);
      return nextChange === -1 || nextChange >= 3 ? month : null;
    }
    return month !== monthOf(weeks[i - 1][0].date) ? month : null;
  });
}

export function monthlyTotals(weeks: ContributionDay[][]) {
  const totals = new Map<string, number>();
  for (const day of weeks.flat()) {
    const key = `${monthOf(day.date)} ${day.date.slice(0, 4)}`;
    totals.set(key, (totals.get(key) ?? 0) + day.count);
  }
  return [...totals.entries()].map(([month, count]) => ({ month, count }));
}
