"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { playSoftTick, unlockAudio } from "@/lib/sound";

interface GraphTooltipProps {
  children: ReactNode;
}

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const GAP = 6; // px between the cell and the tooltip
// Softer than power3 so the glide decelerates gradually; long enough to read
// as smooth, short enough (≤300ms) not to trail the pointer.
const EASE = "power2.out";
const GLIDE = 0.28;

// Instant tooltip for the contribution cells, read from each cell's data-tip.
// It glides from cell to cell instead of blinking out and back in.
// Mouse only; screen readers get the monthly table instead.
export function GraphTooltip({ children }: GraphTooltipProps) {
  const scope = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      const el = tip.current;
      if (!root || !el || !contextSafe) return;

      const moveX = gsap.quickTo(el, "x", { duration: GLIDE, ease: EASE });
      const moveY = gsap.quickTo(el, "y", { duration: GLIDE, ease: EASE });
      let shown = false;
      let current: HTMLElement | null = null;

      const show = contextSafe((event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const cell = (event.target as HTMLElement).closest<HTMLElement>(
          "[data-tip]",
        );
        if (!cell) return;
        if (cell !== current) playSoftTick();
        current = cell;

        el.textContent = cell.dataset.tip ?? "";
        const box = root.getBoundingClientRect();
        const rect = cell.getBoundingClientRect();
        const half = el.offsetWidth / 2;
        const x = gsap.utils.clamp(
          half,
          box.width - half,
          rect.left - box.left + rect.width / 2,
        );
        const y = rect.top - box.top - GAP;
        const motion = window.matchMedia(MOTION_OK).matches;

        if (shown && motion) {
          moveX(x);
          moveY(y);
          return;
        }

        // First appearance (or reduced motion): place it, then fade in.
        moveX.tween.kill();
        moveY.tween.kill();
        gsap.set(el, { x, y });
        gsap.fromTo(
          el,
          { autoAlpha: 0, scale: motion ? 0.96 : 1 },
          { autoAlpha: 1, scale: 1, duration: 0.2, ease: EASE },
        );
        shown = true;
      });

      const hide = contextSafe(() => {
        current = null;
        if (!shown) return;
        shown = false;
        gsap.to(el, { autoAlpha: 0, duration: 0.15, ease: EASE });
      });

      root.addEventListener("pointerover", show);
      root.addEventListener("pointerleave", hide);
      // Audio can only start from a real gesture, so unlock on the first one.
      window.addEventListener("pointerdown", unlockAudio, { once: true });
      window.addEventListener("keydown", unlockAudio, { once: true });
      return () => {
        root.removeEventListener("pointerover", show);
        root.removeEventListener("pointerleave", hide);
        window.removeEventListener("pointerdown", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative">
      {children}
      <span
        ref={tip}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 z-20 origin-bottom -translate-x-1/2 -translate-y-full rounded-md bg-fg px-2 py-1 text-2xs whitespace-nowrap text-on-fg"
      />
    </div>
  );
}
