"use client";

import { useEffect } from "react";
import { playBubble } from "@/lib/sound";

const CLICKABLE = "a[href], button, summary, [role='button']";

// Plays the bubble sound for every link and button click on the site.
// One delegated listener, so components don't need to know about it.
export function ClickSound() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const el = target?.closest<HTMLElement>(CLICKABLE);
      if (!el || el.matches(":disabled, [aria-disabled='true']")) return;
      playBubble();
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
