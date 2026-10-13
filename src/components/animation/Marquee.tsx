"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  rows: ReactNode[][];
}

const SPEED = 40; // px per second

// Static wrapped rows without JS and under reduced motion;
// an infinite scroll in alternating directions otherwise. The markup is the same
// either way (the motion-safe:in-[.js] classes switch the layout), so hydration
// never swaps the DOM and shifts the page mid-intro.
export function Marquee({ rows }: MarqueeProps) {
  const scope = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tracks = gsap.utils.toArray<HTMLElement>("[data-track]");
        // Read every width before any tween writes a transform.
        const widths = tracks.map((track) => track.offsetWidth);
        const tl = gsap.timeline();
        tracks.forEach((track, i) => {
          const reverse = i % 2 === 1;
          tl.fromTo(
            track,
            { xPercent: reverse ? -50 : 0 },
            {
              xPercent: reverse ? 0 : -50,
              duration: widths[i] / 2 / SPEED,
              ease: "none",
              repeat: -1,
            },
            0,
          );
        });
        timeline.current = tl;
        return () => {
          timeline.current = null;
        };
      });
    },
    { scope },
  );

  const pause = () => timeline.current?.pause();
  const play = () => timeline.current?.play();

  return (
    <div
      ref={scope}
      onMouseEnter={pause}
      onMouseLeave={play}
      className="flex flex-col gap-3 motion-safe:in-[.js]:overflow-hidden motion-safe:in-[.js]:mask-x-from-90% motion-safe:in-[.js]:mask-x-to-100%"
    >
      {rows.map((row, i) => (
        <div key={i} data-track className="flex motion-safe:in-[.js]:w-max">
          {[false, true].map((copy) => (
            <ul
              key={String(copy)}
              aria-hidden={copy || undefined}
              className={cn(
                "flex-wrap gap-x-8 gap-y-3 motion-safe:in-[.js]:shrink-0 motion-safe:in-[.js]:flex-nowrap motion-safe:in-[.js]:gap-11 motion-safe:in-[.js]:pr-11",
                copy ? "hidden motion-safe:in-[.js]:flex" : "flex",
              )}
            >
              {row.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}
