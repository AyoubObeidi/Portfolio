"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface PageIntroProps {
  children: ReactNode;
  className?: string;
}

// The page-load sequence. Children start hidden only when JS runs (see globals.css).
export function PageIntro({ children, className }: PageIntroProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(":scope > *", scope.current);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.06,
            // Let hydration finish its first frames so the sequence doesn't stutter.
            delay: 0.1,
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(items, { autoAlpha: 1 });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} data-intro className={className}>
      {children}
    </div>
  );
}
