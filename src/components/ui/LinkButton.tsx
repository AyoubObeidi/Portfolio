import type { ReactNode } from "react";
import { externalLinkProps } from "@/lib/utils";

interface LinkButtonProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  // Extra context for screen readers when the visible label is ambiguous, e.g. "Live" on several cards.
  label?: string;
}

export function LinkButton({ href, icon, children, label }: LinkButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      {...externalLinkProps(href)}
      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-fg transition-colors hover:border-border-strong"
    >
      {icon}
      {children}
    </a>
  );
}
