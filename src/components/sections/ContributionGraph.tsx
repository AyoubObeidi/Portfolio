import { getContributions, monthlyTotals } from "@/lib/github";
import { profile } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/animation/CountUp";
import { GraphReveal } from "@/components/animation/GraphReveal";
import { GraphTooltip } from "@/components/animation/GraphTooltip";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";

const HEAT = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];
const MOBILE_WEEKS = 26;

export const GITHUB_HEADING_ID = "github";

function tipText(count: number, date: string) {
  const day = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  if (count === 0) return `No contributions on ${day}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${day}`;
}

export async function ContributionGraph() {
  const calendar = await getContributions(profile.githubUsername);

  if (!calendar) {
    return (
      <>
        <SectionHeader id={GITHUB_HEADING_ID} title="GitHub" />
        <Panel>
          <p className="text-sm text-fg-muted">
            Couldn&apos;t load GitHub activity right now.
          </p>
        </Panel>
      </>
    );
  }

  const { weeks, total } = calendar;
  const summary = `${total.toLocaleString("en-US")} contributions in the last year`;

  return (
    <>
      <SectionHeader
        id={GITHUB_HEADING_ID}
        title="GitHub"
        aside={
          <p className="text-meta text-fg-muted">
            <CountUp value={total} /> contributions in the last year
          </p>
        }
      />
      <Panel>
        <GraphReveal>
          <GraphTooltip>
            <div
              role="img"
              aria-label={`GitHub activity: ${summary}`}
              className="flex gap-0.5"
            >
              {weeks.map((week, i) => (
                <div
                  key={week[0].date}
                  className={cn(
                    "min-w-0 flex-1 flex-col gap-0.5",
                    i < weeks.length - MOBILE_WEEKS ? "hidden sm:flex" : "flex",
                  )}
                >
                  {i === 0 &&
                    Array.from({ length: 7 - week.length }, (_, k) => (
                      <span key={k} className="aspect-square" />
                    ))}
                  {week.map((day) => (
                    <span
                      key={day.date}
                      data-tip={tipText(day.count, day.date)}
                      className={cn(
                        "relative aspect-square rounded-[2px] transition-[scale] duration-250 ease-out hover:z-10 hover:outline hover:outline-fg-muted motion-safe:hover:scale-125",
                        HEAT[day.level],
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </GraphTooltip>
        </GraphReveal>

        <div
          aria-hidden="true"
          className="mt-3 flex items-center justify-end gap-1 text-2xs text-fg-subtle"
        >
          <span className="mr-1">Less</span>
          {HEAT.map((bg) => (
            <span key={bg} className={cn("size-2.25 rounded-[2px]", bg)} />
          ))}
          <span className="ml-1">More</span>
        </div>

        {/* sr-only goes on a wrapper: tables ignore its 1px size and would add page height. */}
        <div className="sr-only">
          <table>
            <caption>GitHub contributions per month</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Contributions</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTotals(weeks).map(({ month, count }) => (
                <tr key={month}>
                  <th scope="row">{month}</th>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
