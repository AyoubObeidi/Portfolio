import { Suspense } from "react";
import { profile } from "@/lib/profile";
import { LocalTime } from "./LocalTime";
import { NavLinks } from "./NavLinks";

export function SiteNav() {
  const city = profile.location.split(",")[0];

  return (
    <nav
      aria-label="Main"
      className="mb-12 flex items-center justify-between gap-4"
    >
      <NavLinks />
      <p className="font-mono text-xs whitespace-nowrap text-fg-subtle">
        <span className="sr-only">Local time in {city}: </span>
        <Suspense fallback={<span>--:--</span>}>
          <LocalTime timeZone={profile.timeZone} />
        </Suspense>
        <span aria-hidden="true"> · {city}</span>
      </p>
    </nav>
  );
}
