"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface GraphRevealProps {
  children: ReactNode;
}

// The site's one scroll moment: the contribution year fills in left to right, once.
// Nothing is hidden by CSS, so without JS or under reduced motion the cells just render.
export function GraphReveal({ children }: GraphRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // One tween per week column, not per cell: the stagger runs along x, so
        // cells in a column started together anyway, and ~53 tweens instead of
        // ~370 keeps the reveal smooth while the page intro is still playing.
        // Columns hidden on small screens are skipped.
        const columns = gsap.utils
          .toArray<HTMLElement>("[role='img'] > *", scope.current)
          .filter((column) => column.offsetParent !== null);

        // Plays once per visit, so it can afford a small overshoot.
        gsap.from(columns, {
          autoAlpha: 0,
          scale: 0.4,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: { amount: 1, from: "start" },
          scrollTrigger: {
            trigger: scope.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Web fonts can shift layout after this runs.
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
