"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface ChatPlaneProps {
  // The send button's position when the message went out.
  from: DOMRect;
  onDone: () => void;
}

const SIZE = 28;

// A paper plane that takes off from the send button once a message is delivered.
// Only rendered when motion is allowed.
export function ChatPlane({ from, onDone }: ChatPlaneProps) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const panel = el?.parentElement?.getBoundingClientRect();
      if (!el || !panel) return;
      const x = from.left - panel.left + from.width / 2 - SIZE / 2;
      const y = from.top - panel.top - 6;
      gsap.set(el, { x, y });
      gsap
        .timeline({ onComplete: onDone })
        .from(el, { autoAlpha: 0, scale: 0.9, duration: 0.15, ease: "ui-out" })
        .to(
          el,
          {
            keyframes: {
              x: [x, x - 40, x + 60, x + 220],
              y: [y, y * 0.6, y * 0.2, -SIZE * 2],
              rotation: [0, -10, 8, 18],
            },
            duration: 0.9,
            ease: "ui-move",
          },
          0.05,
        )
        .to(el, { autoAlpha: 0, duration: 0.2 }, 0.75);
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-10 size-7 text-fg"
    >
      <path
        d="M21.5 2.5 2.5 10l7 3 3 7 9-17.5Z"
        className="fill-surface"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M21.5 2.5 9.5 13" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}
