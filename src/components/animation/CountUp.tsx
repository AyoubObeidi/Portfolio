"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface CountUpProps {
  value: number;
}

const format = (n: number) => Math.round(n).toLocaleString("en-US");

// Counts up alongside GraphReveal. The server renders the final number, so it
// stays correct without JS and under reduced motion.
export function CountUp({ value }: CountUpProps) {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { n: 0 };
        el.textContent = format(0);
        gsap.to(counter, {
          n: value,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = format(counter.n);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        return () => {
          el.textContent = format(value);
        };
      });
    },
    { scope, dependencies: [value] },
  );

  // Reserve the final width so the counting digits don't re-layout the row each frame.
  return (
    <span
      ref={scope}
      className="inline-block text-right tabular-nums"
      style={{ minWidth: `${format(value).length}ch` }}
    >
      {format(value)}
    </span>
  );
}
