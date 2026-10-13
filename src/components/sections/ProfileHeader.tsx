import Image from "next/image";
import { OpenToWorkBadge } from "@/components/animation/OpenToWorkBadge";
import { profile } from "@/lib/profile";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileHeader() {
  return (
    <header className="flex items-center gap-5">
      {profile.avatar ? (
        <Image
          src={profile.avatar.src}
          alt={profile.avatar.alt}
          width={72}
          height={72}
          preload
          className="size-18 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid size-18 shrink-0 place-items-center rounded-xl bg-placeholder text-title font-medium text-fg-body"
        >
          {initials(profile.name)}
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="text-display font-semibold tracking-[-0.02em]">
          {profile.name}
        </h1>
        <p className="flex flex-wrap items-center gap-2.5 text-sm text-fg-muted">
          <span>{profile.role}</span>
          {profile.available && (
            <OpenToWorkBadge after={0.8} />
          )}
        </p>
      </div>
    </header>
  );
}
