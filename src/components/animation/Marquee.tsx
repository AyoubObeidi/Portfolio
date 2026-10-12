"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  rows: ReactNode[][];
}

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const SPEED = 40; // px per second

function subscribe(onChange: () => void) {
  const query = window.matchMedia(MOTION_OK);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Static wrapped rows on the server, without JS, and under reduced motion;
// an infinite scroll in alternating directions otherwise.
export function Marquee({ rows }: MarqueeProps) {
  const scope = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const animated = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOTION_OK).matches,
    () => false,
  );

  useGSAP(
    () => {
      if (!animated) return;
      const tl = gsap.timeline();
      gsap.utils.toArray<HTMLElement>("[data-track]").forEach((track, i) => {
        const reverse = i % 2 === 1;
        tl.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          {
            xPercent: reverse ? 0 : -50,
            duration: track.offsetWidth / 2 / SPEED,
            ease: "none",
            repeat: -1,
          },
          0,
        );
      });
      timeline.current = tl;
    },
    { scope, dependencies: [animated], revertOnUpdate: true },
  );

  const pause = () => timeline.current?.pause();
  const play = () => timeline.current?.play();

  return (
    <div
      ref={scope}
      onMouseEnter={pause}
      onMouseLeave={play}
      className={cn(
        "flex flex-col gap-4",
        animated && "overflow-hidden mask-x-from-90% mask-x-to-100%",
      )}
    >
      {rows.map((row, i) =>
        animated ? (
          <div key={i} data-track className="flex w-max">
            {[false, true].map((copy) => (
              <ul
                key={String(copy)}
                aria-hidden={copy || undefined}
                className="flex shrink-0 gap-8 pr-8"
              >
                {row.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ))}
          </div>
        ) : (
          <ul key={i} className="flex flex-wrap gap-x-8 gap-y-3">
            {row.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
