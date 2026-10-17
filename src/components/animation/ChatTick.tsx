"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK, REDUCED_MOTION } from "@/lib/motion";

interface ChatTickProps {
  // Position among the visitor's answers; ticks land one after another.
  index: number;
}

// Delivered tick on a sent answer, like a read receipt.
export function ChatTick({ index }: ChatTickProps) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const delay = 0.1 + index * 0.08;
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, {
          autoAlpha: 0,
          scale: 0.9,
          duration: 0.2,
          ease: "ui-out",
          delay,
        });
      });
      mm.add(REDUCED_MOTION, () => {
        gsap.from(ref.current, { autoAlpha: 0, duration: 0.2, delay });
      });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 16 16"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mb-0.75 size-3.5 shrink-0 text-success-dot"
    >
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}
