"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ChatComposer } from "@/components/animation/ChatComposer";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { STEPS } from "@/lib/contact";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { profile } from "@/lib/profile";
import type { Conversation } from "@/lib/useConversation";

interface ChatDockProps {
  conversation: Conversation;
  onClose: () => void;
  // Fired after a successful send with the send button's position, for the paper plane.
  onSent: (from: DOMRect) => void;
  ref: RefObject<HTMLDivElement | null>;
}

// Bottom of the chat: the composer while answering, then review, sent or failed.
export function ChatDock({ conversation, onClose, onSent, ref }: ChatDockProps) {
  const { phase, step, draft, setDraft, answer, send } = conversation;
  const sendRef = useRef<HTMLDivElement>(null);
  const mode =
    phase === "sent" || phase === "failed"
      ? phase
      : step >= STEPS.length
        ? "review"
        : "compose";

  // Each mode change slides the new controls in.
  useGSAP(
    () => {
      const el = ref.current?.firstElementChild;
      if (!el) return;
      gsap.from(el, {
        opacity: 0, // opacity, not autoAlpha: the composer inside must stay focusable
        y: prefersReducedMotion() ? 0 : 6,
        duration: 0.2,
        ease: "ui-out",
      });
    },
    { dependencies: [mode], scope: ref },
  );

  // Once the questions are done, keep keyboard focus on the next thing to do.
  useEffect(() => {
    const dock = ref.current;
    if (mode === "compose" || phase === "sending" || !dock?.closest("dialog")?.open)
      return;
    dock.querySelector<HTMLElement>("button:not(:disabled)")?.focus({ preventScroll: true });
  }, [mode, phase, ref]);

  const onSend = async () => {
    const from = sendRef.current?.getBoundingClientRect();
    if ((await send()) && from && !prefersReducedMotion()) onSent(from);
  };

  return (
    <div
      ref={ref}
      data-chat-part
      className="border-t border-border bg-surface p-3"
    >
      {mode === "compose" && (
        <ChatComposer
          key={step}
          step={step}
          value={draft}
          onChange={setDraft}
          canSubmit={phase === "answering"}
          onAnswer={(text, origin) => answer(text, origin)}
        />
      )}
      {mode === "review" && (
        <div className="flex items-center justify-between gap-3 pl-1">
          <p className="text-meta text-fg-subtle">Tap an answer to change it.</p>
          <div ref={sendRef}>
            <Button
              variant="primary"
              onClick={onSend}
              busy={phase === "sending"}
              disabled={phase !== "review" && phase !== "sending"}
            >
              {phase === "sending" ? "Sending" : "Send message"}
            </Button>
          </div>
        </div>
      )}
      {mode === "sent" && (
        <div className="flex items-center justify-between gap-3 pl-1">
          <p className="flex items-center gap-1.5 text-meta text-success-fg">
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3.5"
            >
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
            Sent to Ayoub
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
      {mode === "failed" && (
        <div role="alert" className="flex flex-col gap-3 pl-1">
          <p className="text-meta text-danger-fg">
            That didn&apos;t send. Try again, or email me directly.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={onSend}>
              Try again
            </Button>
            <LinkButton href={`mailto:${profile.email}`}>Email me</LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
