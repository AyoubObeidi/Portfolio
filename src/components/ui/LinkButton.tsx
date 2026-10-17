import Link from "next/link";
import type { ReactNode } from "react";
import { LiquidMetalFace } from "@/components/ui/LiquidMetalFace";
import { NewTabNote } from "@/components/ui/NewTabNote";
import {
  BUTTON_BASE,
  BUTTON_VARIANTS,
  type ButtonVariant,
} from "@/components/ui/buttonStyles";
import { cn, externalLinkProps } from "@/lib/utils";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: ButtonVariant;
  // Extra context for screen readers when the visible label is ambiguous.
  label?: string;
  // Name of a dialog that opens instead of following the link once JS has loaded.
  opensDialog?: string;
}

export function LinkButton({
  href,
  children,
  icon,
  variant = "outline",
  label,
  opensDialog,
}: LinkButtonProps) {
  const className = cn(BUTTON_BASE, BUTTON_VARIANTS[variant]);
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
    <a
      href={href}
      aria-label={label}
      data-dialog-trigger={opensDialog}
      aria-haspopup={opensDialog ? "dialog" : undefined}
      {...linkProps}
      className={className}
    >
      {content}
      {linkProps.target && !label && <NewTabNote />}
    </a>
  );
}
