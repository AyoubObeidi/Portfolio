"use client";

import { useRef } from "react";
import { TOPICS } from "@/lib/contact";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK, REDUCED_MOTION, prefersReducedMotion } from "@/lib/motion";
import type { Origin } from "@/lib/useConversation";

interface ChatChipsProps {
  onPick: (topic: string, origin: Origin) => void;
}

// Quick replies for the first question. The picked chip becomes the visitor's answer.
export function ChatChips({ onPick }: ChatChipsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const picked = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      const row = ref.current;
      if (!row) return;
      const thread = row.closest<HTMLElement>("[data-thread]");
      if (thread) thread.scrollTop = thread.scrollHeight;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(row.children, {
          y: 6,
          autoAlpha: 0,
          duration: 0.22,
          stagger: 0.04,
          ease: "ui-out",
          delay: 0.08,
        });
      });
      mm.add(REDUCED_MOTION, () => {
        gsap.from(row, { autoAlpha: 0, duration: 0.2 });
      });
    },
    { scope: ref },
  );

  // The other chips step aside, then the picked one flies into the thread.
  const pick = (chip: HTMLButtonElement) => contextSafe(async () => {
    if (picked.current || !ref.current) return;
    picked.current = true;
    const others = [...ref.current.children].filter((c) => c !== chip);
    await gsap.to(others, {
      autoAlpha: 0,
      scale: prefersReducedMotion() ? 1 : 0.97,
      duration: 0.15,
      ease: "ui-out",
    });
    onPick(chip.textContent ?? "", chip.getBoundingClientRect());
  })();

  return (
    <div
      ref={ref}
      data-step={0}
      className="flex max-w-[92%] flex-wrap justify-end gap-1.5 self-end"
    >
      {TOPICS.map((topic) => (
        <button
          key={topic}
          type="button"
          onClick={(e) => pick(e.currentTarget)}
          className="h-8 cursor-pointer rounded-full border border-border-control bg-surface px-3 text-meta text-fg transition-[border-color,scale] duration-150 ease-out hover:border-border-strong active:scale-97"
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
