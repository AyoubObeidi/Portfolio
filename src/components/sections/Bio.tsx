import { profile } from "@/lib/profile";
import { cn } from "@/lib/utils";

export function Bio() {
  return (
    <div className="flex max-w-prose flex-col gap-3 text-base leading-[1.65] text-pretty">
      {profile.bio.map((paragraph, i) => (
        <p key={i} className={cn(i === 0 ? "text-fg-body" : "text-fg-muted")}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}
