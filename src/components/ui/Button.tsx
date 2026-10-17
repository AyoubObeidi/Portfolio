import type { MouseEvent, ReactNode } from "react";
import { LiquidMetalFace } from "@/components/ui/LiquidMetalFace";
import {
  BUTTON_BASE,
  BUTTON_VARIANTS,
  type ButtonVariant,
} from "@/components/ui/buttonStyles";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  // Shows a spinner and blocks clicks while an action is in flight.
  busy?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = "outline",
  busy = false,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy || undefined}
      className={cn(
        BUTTON_BASE,
        BUTTON_VARIANTS[variant],
        "cursor-pointer disabled:cursor-default aria-busy:pointer-events-none",
      )}
    >
      {variant === "primary" && <LiquidMetalFace />}
      {busy && (
        <span
          aria-hidden
          className="size-3.5 animate-spin rounded-full border-2 border-border-strong border-t-fg"
        />
      )}
      {children}
    </button>
  );
}
