"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SERIES, xAt, type ChartPoint } from "@/lib/chart";
import { playSoftTick, unlockAudio } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface ChartCursorProps {
  points: ChartPoint[];
  max: number;
}

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const GLIDE = { duration: 0.25, ease: "power2.out" };

// Hover guide for TrafficChart: a vertical line with a dot per series and a
// tooltip, gliding between data points. Mouse only; the table covers the rest.
export function ChartCursor({ points, max }: ChartCursorProps) {
  const scope = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [flip, setFlip] = useState(false);

  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      const el = cursor.current;
      if (!root || !el || !contextSafe) return;

      const moveX = gsap.quickTo(el, "x", GLIDE);
      const moveDots = dots.current.map((dot) => gsap.quickTo(dot, "y", GLIDE));
      let current: number | null = null;

      const move = contextSafe((event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const box = root.getBoundingClientRect();
        const ratio = (event.clientX - box.left) / box.width;
        const index = gsap.utils.clamp(
          0,
          points.length - 1,
          Math.round(ratio * (points.length - 1)),
        );
        if (index === current) return;

        const x = xAt(index, points.length, box.width);
        const ys = SERIES.map(
          (s) => box.height - (points[index][s.key] / max) * box.height,
        );
        const glide = current !== null && window.matchMedia(MOTION_OK).matches;

        if (glide) {
          moveX(x);
          ys.forEach((y, i) => moveDots[i](y));
        } else {
          moveX(x, x);
          ys.forEach((y, i) => moveDots[i](y, y));
          gsap.to(el, { autoAlpha: 1, duration: 0.15 });
        }
        if (current !== null) playSoftTick();
        current = index;
        setActive(index);
        setFlip(x > box.width / 2);
      });

      const leave = contextSafe(() => {
        current = null;
        gsap.to(el, { autoAlpha: 0, duration: 0.15 });
      });

      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", leave);
      window.addEventListener("pointerdown", unlockAudio, { once: true });
      return () => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
        window.removeEventListener("pointerdown", unlockAudio);
      };
    },
    { scope, dependencies: [points, max], revertOnUpdate: true },
  );

  const point = active === null ? null : points[active];

  return (
    <div ref={scope} aria-hidden="true" className="absolute inset-0">
      <div
        ref={cursor}
        className="pointer-events-none invisible absolute inset-y-0 left-0 w-px bg-border-strong"
      >
        {SERIES.map((s, i) => (
          <span
            key={s.key}
            ref={(node) => {
              dots.current[i] = node;
            }}
            className={cn(
              "absolute top-0 left-0 size-2 -translate-1/2 rounded-full ring-2 ring-surface",
              s.bg,
            )}
          />
        ))}
        {point && (
          <div
            className={cn(
              "absolute top-0 w-max rounded-md bg-fg px-2.5 py-1.5 text-2xs text-on-fg",
              flip ? "right-3" : "left-3",
            )}
          >
            <p className="font-medium">{point.title}</p>
            {[...SERIES].reverse().map((s) => (
              <p key={s.key} className="flex items-center gap-1.5 tabular-nums">
                <span className={cn("size-1.5 rounded-full", s.bg)} />
                {point[s.key].toLocaleString("en-US")} {s.label.toLowerCase()}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
