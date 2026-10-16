import Link from "next/link";
import type { ReactNode } from "react";
import { LiquidMetalRim } from "@/components/animation/LiquidMetalRim";
import { NewTabNote } from "@/components/ui/NewTabNote";
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
  primary:
    "relative isolate overflow-hidden px-4 font-medium text-fg shadow-metal",
  outline:
    "border border-border-control bg-surface px-3.5 text-fg hover:border-border-strong",
};

// Liquid-metal rim behind a glossy light face, after Paper Design's chroma-glass buttons.
function LiquidMetalFace() {
  return (
    <>
      <LiquidMetalRim />
      <span
        aria-hidden
        className="absolute inset-[3px] -z-10 rounded-[calc(var(--radius-lg)-3px)] bg-linear-to-b from-surface to-surface-raised shadow-metal-inset"
      />
    </>
  );
}

export function LinkButton({
  href,
  children,
  icon,
  variant = "outline",
  label,
}: LinkButtonProps) {
  const className = cn(
    "inline-flex h-9 items-center gap-2 rounded-lg text-sm whitespace-nowrap transition-[color,background-color,border-color,translate,scale] duration-150 ease-out motion-safe:hover:-translate-y-px active:translate-y-0 active:scale-97",
    VARIANTS[variant],
  );
  const content = (
    <>
      {variant === "primary" && <LiquidMetalFace />}
      {icon}
      {children}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {content}
      </Link>
    );
  }

  const linkProps = externalLinkProps(href);

  return (
    <a href={href} aria-label={label} {...linkProps} className={className}>
      {content}
      {linkProps.target && !label && <NewTabNote />}
    </a>
  );
}
