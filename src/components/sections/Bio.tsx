import { profile } from "@/lib/profile";

export function Bio() {
  return (
    <ul className="max-w-prose list-disc space-y-1.5 pl-5 text-sm text-fg-muted marker:text-fg-subtle">
      {profile.bio.map((line, i) => (
        <li key={i}>
          {line.map((segment, j) =>
            typeof segment === "string" ? (
              segment
            ) : (
              <strong key={j} className="font-semibold text-fg">
                {segment.strong}
              </strong>
            ),
          )}
        </li>
      ))}
    </ul>
  );
}
