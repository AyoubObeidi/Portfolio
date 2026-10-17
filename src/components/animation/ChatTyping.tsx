"use client";

import { useRef } from "react";
import { enterThread } from "@/lib/chatMotion";
import { useGSAP } from "@/lib/gsap";

const DELAYS = ["0ms", "160ms", "320ms"];

// Three blinking dots while Ayoub "types" the next message.
export function ChatTyping() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (ref.current) enterThread(ref.current);
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      role="status"
      aria-label="Ayoub is typing"
      className="inline-flex origin-bottom-left gap-1 self-start rounded-2xl rounded-bl-sm border border-border bg-surface p-3"
    >
      {DELAYS.map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: delay }}
          className="size-1.5 animate-blink rounded-full bg-fg-subtle motion-reduce:animate-none motion-reduce:opacity-60"
        />
      ))}
    </div>
  );
}
