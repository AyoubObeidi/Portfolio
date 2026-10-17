"use client";

import { useRef } from "react";
import { ChatTick } from "@/components/animation/ChatTick";
import { enterThread } from "@/lib/chatMotion";
import { useGSAP } from "@/lib/gsap";
import type { Origin } from "@/lib/useConversation";

interface ChatBubbleProps {
  side: "them" | "me";
  text: string;
  step: number;
  // Answers only: where the bubble flies in from.
  origin?: Origin;
  // Answers only: tapping the bubble rewinds to its question.
  onEdit?: (step: number, bubble: HTMLElement) => void;
  // Answers only: shows a tick once the message is sent; the index staggers them.
  tickIndex?: number;
  label?: string;
}

export function ChatBubble({
  side,
  text,
  step,
  origin,
  onEdit,
  tickIndex,
  label,
}: ChatBubbleProps) {
  const ref = useRef<HTMLParagraphElement & HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (ref.current) enterThread(ref.current, origin);
    },
    { scope: ref },
  );

  const shared =
    "max-w-[82%] rounded-2xl px-3 py-2 text-sm/5 whitespace-pre-wrap [overflow-wrap:anywhere]";

  if (side === "them") {
    return (
      <p
        ref={ref}
        data-step={step}
        className={`${shared} self-start rounded-bl-sm border border-border bg-surface text-fg-body origin-bottom-left`}
      >
        {text}
      </p>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      data-step={step}
      disabled={!onEdit}
      aria-label={onEdit ? label : undefined}
      onClick={(e) => onEdit?.(step, e.currentTarget)}
      className={`${shared} inline-flex origin-bottom-right items-end gap-1.5 self-end rounded-br-sm bg-fg text-left text-on-fg transition-colors duration-150 enabled:cursor-pointer enabled:hover:bg-fg-body`}
    >
      <span>{text}</span>
      {onEdit && (
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-1 size-3 shrink-0 opacity-55"
        >
          <path d="M11 2.5l2.5 2.5L6 12.5H3.5V10z" />
        </svg>
      )}
      {tickIndex !== undefined && <ChatTick index={tickIndex} />}
    </button>
  );
}
