import { Suspense } from "react";
import Image from "next/image";
import { profile } from "@/lib/profile";
import { UiIcon } from "@/components/ui/UiIcon";
import { LocalTime } from "./LocalTime";

function initials(name: string) {
  return name
    .replace(/\[.*?\]/g, "")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileHeader() {
  return (
    <header className="flex items-center gap-4 pt-6 sm:gap-6">
      {profile.avatar ? (
        <Image
          src={profile.avatar.src}
          alt={profile.avatar.alt}
          width={96}
          height={96}
          priority
          className="size-20 shrink-0 rounded-md object-cover sm:size-24"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid size-20 shrink-0 place-items-center rounded-md border border-border bg-surface-raised text-2xl font-semibold text-fg-muted sm:size-24"
        >
          {initials(profile.name)}
        </div>
      )}

      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
          {profile.name}
        </h1>
        <p className="font-mono text-xs text-fg-muted">{profile.handle}</p>
        <p className="mt-1.5 text-sm font-medium">{profile.status}</p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-fg-muted">
          <span className="inline-flex items-center gap-1">
            <UiIcon name="mapPin" className="size-3" />
            {profile.location}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <UiIcon name="clock" className="size-3" />
            <Suspense fallback={<span>{profile.timeZone}</span>}>
              <LocalTime timeZone={profile.timeZone} />
            </Suspense>
          </span>
        </p>
      </div>
    </header>
  );
}
