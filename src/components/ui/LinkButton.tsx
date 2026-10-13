import Link from "next/link";
import type { ReactNode } from "react";
import { externalLinkProps } from "@/lib/utils";

interface LinkButtonProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  // Extra context for screen readers when the visible label is ambiguous, e.g. "Live" on several cards.
  label?: string;
}

const className =
  "inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-fg transition-colors hover:border-border-strong";

export function LinkButton({ href, icon, children, label }: LinkButtonProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      aria-label={label}
      {...externalLinkProps(href)}
      className={className}
    >
      {icon}
      {children}
    </a>
  );
}
