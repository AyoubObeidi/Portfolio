import type { TopItem } from "@/lib/analytics";
import { Panel } from "@/components/ui/Panel";

interface TopListProps {
  title: string;
  items: TopItem[];
}

// A ranked list of the top values for one dimension, by visitors.
export function TopList({ title, items }: TopListProps) {
  const max = Math.max(1, ...items.map((item) => item.visitors));

  return (
    <Panel>
      <h3 className="flex items-baseline justify-between text-meta">
        <span className="font-medium text-fg">{title}</span>
        <span className="text-2xs text-fg-subtle">Visitors</span>
      </h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-fg-muted">Nothing recorded yet.</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-1">
          {items.map((item) => (
            <li
              key={item.label}
              className="relative flex items-center justify-between gap-3 overflow-hidden rounded-md px-2 py-1 text-sm"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded-md bg-surface-raised"
                style={{ width: `${(item.visitors / max) * 100}%` }}
              />
              <span className="relative truncate text-fg-body">
                {item.label}
              </span>
              <span className="relative font-mono text-meta text-fg-muted tabular-nums">
                {item.visitors.toLocaleString("en-US")}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
