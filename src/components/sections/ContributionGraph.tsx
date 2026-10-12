import { getContributions, monthLabels, monthlyTotals } from "@/lib/github";
import { profile } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";

const HEAT = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];
const MOBILE_WEEKS = 26;

export async function ContributionGraph() {
  const calendar = await getContributions(profile.githubUsername);

  if (!calendar) {
    return (
      <Panel>
        <p className="text-sm text-fg-muted">
          Couldn&apos;t load GitHub activity right now.
        </p>
      </Panel>
    );
  }

  const { weeks, total } = calendar;
  const labels = monthLabels(weeks);
  const summary = `${total.toLocaleString("en-US")} contributions in the last year`;

  return (
    <Panel>
      <div
        role="img"
        aria-label={`GitHub activity: ${summary}`}
        className="flex gap-[3px]"
      >
        {weeks.map((week, i) => (
          <div
            key={week[0].date}
            className={cn(
              "min-w-0 flex-1 flex-col gap-[3px]",
              i < weeks.length - MOBILE_WEEKS ? "hidden sm:flex" : "flex",
            )}
          >
            <span className="h-4 text-2xs whitespace-nowrap text-fg-muted">
              {labels[i]}
            </span>
            {i === 0 &&
              Array.from({ length: 7 - week.length }, (_, k) => (
                <span key={k} className="aspect-square" />
              ))}
            {week.map((day) => (
              <span
                key={day.date}
                title={`${day.count} contributions on ${day.date}`}
                className={cn("aspect-square rounded-[2px]", HEAT[day.level])}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <p>{summary}</p>
        <div
          aria-hidden="true"
          className="flex items-center gap-1 text-fg-muted"
        >
          Less
          {HEAT.map((bg) => (
            <span key={bg} className={cn("size-2.5 rounded-[2px]", bg)} />
          ))}
          More
        </div>
      </div>

      <table className="sr-only">
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
    </Panel>
  );
}
