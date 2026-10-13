"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface OpenToWorkBadgeProps {
  // Earliest pop, in seconds after mount; set it to when PageIntro finishes.
  after?: number;
}

// Pops in once the page has loaded, then pops again on a loop. Without JS it's simply shown.
export function OpenToWorkBadge({ after = 0 }: OpenToWorkBadgeProps) {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (context) => {
        gsap.set(scope.current, { autoAlpha: 0, scale: 0.9 });

        const mountedAt = performance.now();
        // Added to this matchMedia context so the late tweens are still reverted on unmount.
        const start = context.add("start", () => {
          const elapsed = (performance.now() - mountedAt) / 1000;
          gsap
            .timeline({ delay: Math.max(after - elapsed, 0) + 0.15 })
            .to(scope.current, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.45,
              ease: "back.out(1.7)",
            })
            .add(
              gsap
                .timeline({ repeat: -1, delay: 2, repeatDelay: 2.5 })
                .to(scope.current, {
                  scale: 1.08,
                  duration: 0.15,
                  ease: "power2.out",
                })
                .to(scope.current, {
                  scale: 1,
                  duration: 0.4,
                  ease: "back.out(2.5)",
                }),
            );
        }) as () => void;

        if (document.readyState === "complete") {
          start();
          return;
        }
        window.addEventListener("load", start, { once: true });
        return () => window.removeEventListener("load", start);
      });
    },
    { scope },
  );

  return (
    <span
      ref={scope}
      className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-0.5 text-xs text-success-fg"
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-success-dot"
      />
      Open to work
    </span>
  );
}
