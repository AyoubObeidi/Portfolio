import Link from "next/link";
import { RANGES, type RangeKey } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface RangeTabsProps {
  active: RangeKey;
}

// Plain links, so switching ranges works without JS and each range has its own URL.
export function RangeTabs({ active }: RangeTabsProps) {
  return (
    <nav aria-label="Time range">
      <ul className="flex items-center gap-1 font-mono text-2xs">
        {(Object.keys(RANGES) as RangeKey[]).map((key) => (
          <li key={key}>
            <Link
              href={`/analytics?range=${key}`}
              scroll={false}
              prefetch
              aria-label={`Show the ${RANGES[key].name}`}
              aria-current={key === active ? "page" : undefined}
              className={cn(
                "block rounded-md px-2 py-1 transition-colors hover:bg-surface-raised",
                key === active ? "bg-surface-raised text-fg" : "text-fg-subtle hover:text-fg",
              )}
            >
              {RANGES[key].label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
