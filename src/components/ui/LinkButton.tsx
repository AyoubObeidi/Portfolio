import Link from "next/link";
import type { ReactNode } from "react";
import { cn, externalLinkProps } from "@/lib/utils";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "outline";
  // Extra context for screen readers when the visible label is ambiguous.
  label?: string;
}

const VARIANTS = {
  primary: "bg-fg px-4 font-medium text-on-fg hover:bg-fg-body",
  outline:
    "border border-border-control bg-surface px-3.5 text-fg hover:border-border-strong",
};

export function LinkButton({
  href,
  children,
  icon,
  variant = "outline",
  label,
}: LinkButtonProps) {
  const className = cn(
    "inline-flex h-9 items-center gap-2 rounded-lg text-sm whitespace-nowrap transition-colors",
    VARIANTS[variant],
  );

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
