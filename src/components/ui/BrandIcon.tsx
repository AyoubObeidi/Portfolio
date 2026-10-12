import type { CSSProperties } from "react";
import type { BrandIconData } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface BrandIconProps {
  icon: BrandIconData;
  className?: string;
  style?: CSSProperties;
}

export function BrandIcon({ icon, className, style }: BrandIconProps) {
  return (
    <svg
      style={style}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("size-4 shrink-0 fill-current", className)}
    >
      <path d={icon.path} />
    </svg>
  );
}
