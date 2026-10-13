"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/analytics", label: "Analytics" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1 text-sm">
      {NAV_ITEMS.map(({ href, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-md px-2.5 py-1.5 transition-colors hover:bg-surface-raised",
                active ? "text-fg" : "text-fg-subtle hover:text-fg",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
