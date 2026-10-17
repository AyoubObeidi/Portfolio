"use client";

import { useRef, type RefObject } from "react";
import { ChatBubble } from "@/components/animation/ChatBubble";
import { ChatChips } from "@/components/animation/ChatChips";
import { ChatTyping } from "@/components/animation/ChatTyping";
import { STEPS } from "@/lib/contact";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import type { Conversation } from "@/lib/useConversation";

interface ChatThreadProps {
  conversation: Conversation;
  // The composer area; a rewound answer drops back into it.
  dockRef: RefObject<HTMLDivElement | null>;
}

export function ChatThread({ conversation, dockRef }: ChatThreadProps) {
  const { items, phase, answer, rewind } = conversation;
  const threadRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: threadRef });
  const canEdit = phase === "answering" || phase === "review";
  const sent = phase === "sent";

  // Later messages clear away (newest first), the tapped answer drops back into the
  // composer, and the conversation rewinds to that question.
  const edit = (step: number, bubble: HTMLElement) => contextSafe(async () => {
    const thread = threadRef.current;
    if (!thread) return;
    const reduce = prefersReducedMotion();
    const later = [...thread.querySelectorAll<HTMLElement>("[data-step]")]
      .filter((el) => Number(el.dataset.step) > step)
      .reverse();
    if (later.length) {
      await gsap.to(later, {
        autoAlpha: 0,
        y: reduce ? 0 : 4,
        duration: 0.15,
        stagger: 0.03,
        ease: "ui-out",
      });
    }
    const target = dockRef.current?.getBoundingClientRect();
    if (!reduce && target) {
      const from = bubble.getBoundingClientRect();
      await gsap.to(bubble, {
        x: target.left + 12 - from.left,
        y: target.top + 12 - from.top,
        autoAlpha: 0,
        duration: 0.28,
        ease: "ui-move",
      });
    }
    rewind(step);
  })();

  let answerIndex = 0;

  return (
    <div
      ref={threadRef}
      data-thread
      data-chat-part
      className="flex-1 overflow-y-auto overscroll-contain bg-bg"
    >
      <div
        role="log"
        aria-label="Conversation"
        className="flex min-h-full flex-col justify-end gap-2 p-4"
      >
        {items.map((item) => {
          if (item.kind === "typing") return <ChatTyping key={item.id} />;
          if (item.kind === "chips")
            return <ChatChips key={item.id} onPick={(t, o) => answer(t, o)} />;
          if (item.kind === "them")
            return (
              <ChatBubble
                key={item.id}
                side="them"
                text={item.text}
                step={item.step}
              />
            );
          const index = answerIndex++;
          return (
            <ChatBubble
              key={item.id}
              side="me"
              text={item.text}
              step={item.step}
              origin={item.origin}
              onEdit={canEdit ? edit : undefined}
              tickIndex={sent ? index : undefined}
              label={`Your ${STEPS[item.step].key}: ${item.text}. Change this answer`}
            />
          );
        })}
      </div>
    </div>
  );
}
