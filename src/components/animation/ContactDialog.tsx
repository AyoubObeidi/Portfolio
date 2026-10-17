"use client";

import { useRef, useState } from "react";
import { ChatDock } from "@/components/animation/ChatDock";
import { ChatHeader } from "@/components/animation/ChatHeader";
import { ChatPlane } from "@/components/animation/ChatPlane";
import { ChatThread } from "@/components/animation/ChatThread";
import { gsap, useGSAP } from "@/lib/gsap";
import { isPhone, prefersReducedMotion } from "@/lib/motion";
import { useConversation } from "@/lib/useConversation";
import { useSheetDrag } from "@/lib/useSheetDrag";

// Links rendered by ContactButton; they stay plain mailto links until this hydrates.
const TRIGGER = '[data-dialog-trigger="contact"]';
// Opening lands focus in the dock: the reply box, or its first button after the questions.
const FOCUSABLE = "input, textarea, button:not(:disabled)";

// The contact chat. Desktop: grows out of the clicked button and shrinks back into it.
// Phones: a bottom sheet that can be dragged down. Escape closes instantly.
export function ContactDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const morph = useRef<gsap.core.Timeline | null>(null);
  const [plane, setPlane] = useState<DOMRect | null>(null);
  const conversation = useConversation();
  const { start } = conversation;

  useSheetDrag(dialogRef, panelRef, handleRef);

  const { contextSafe } = useGSAP(
    (_, contextSafe) => {
      const dialog = dialogRef.current;
      const panel = panelRef.current;
      if (!dialog || !panel || !contextSafe) return;
      const label = panel.querySelector("[data-morph-label]");
      const parts = () => [...panel.querySelectorAll("[data-chat-part]")];
      let opener: HTMLElement | null = null;

      const open = contextSafe((trigger: HTMLElement) => {
        opener = trigger;
        dialog.showModal();
        start();
        dockRef.current
          ?.querySelector<HTMLElement>(FOCUSABLE)
          ?.focus({ preventScroll: true });
        morph.current = null;
        if (prefersReducedMotion()) {
          gsap.from(panel, { opacity: 0, duration: 0.2 });
          return;
        }
        if (isPhone()) {
          gsap.from(panel, { yPercent: 100, duration: 0.42, ease: "drawer" });
          return;
        }
        const p = panel.getBoundingClientRect();
        const b = trigger.getBoundingClientRect();
        const insetX = Math.max(0, (p.width - b.width) / 2);
        const insetY = Math.max(0, (p.height - b.height) / 2);
        morph.current = gsap
          .timeline()
          .fromTo(
            panel,
            {
              x: b.left + b.width / 2 - (p.left + p.width / 2),
              y: b.top + b.height / 2 - (p.top + p.height / 2),
              clipPath: `inset(${insetY}px ${insetX}px round 8px)`,
            },
            {
              x: 0,
              y: 0,
              clipPath: "inset(0px 0px round 16px)",
              duration: 0.42,
              ease: "drawer",
            },
          )
          .fromTo(label, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12, ease: "none" }, 0)
          .from(parts(), { opacity: 0, y: 6, duration: 0.24, stagger: 0.04, ease: "ui-out" }, 0.18);
      });

      const onClick = (event: MouseEvent) => {
        const trigger = (event.target as Element | null)?.closest<HTMLElement>(TRIGGER);
        // Modified clicks keep the link's own behaviour.
        if (!trigger || event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        open(trigger);
      };

      const onClosed = () => {
        gsap.killTweensOf([panel, label, ...parts()]);
        gsap.set([panel, label, ...parts()], { clearProps: "all" });
        morph.current = null;
        opener?.focus({ preventScroll: true });
      };

      document.addEventListener("click", onClick);
      dialog.addEventListener("close", onClosed);
      return () => {
        document.removeEventListener("click", onClick);
        dialog.removeEventListener("close", onClosed);
      };
    },
    { scope: panelRef },
  );

  const close = () => contextSafe(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog?.open || !panel) return;
    const done = () => dialog.close();
    if (prefersReducedMotion()) {
      gsap.to(panel, { autoAlpha: 0, duration: 0.15, onComplete: done });
    } else if (isPhone()) {
      gsap.to(panel, { yPercent: 100, duration: 0.3, ease: "drawer", onComplete: done });
    } else if (morph.current) {
      // Back into the button it came from, a little faster than the open.
      morph.current.timeScale(1.5).reverse().eventCallback("onReverseComplete", done);
    } else {
      gsap.to(panel, { autoAlpha: 0, scale: 0.97, duration: 0.18, ease: "ui-out", onComplete: done });
    }
  })();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="contact-chat-title"
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto h-[min(37.5rem,calc(100dvh-3rem))] w-[min(var(--container-chat),calc(100vw-2rem))] max-h-none max-w-none overflow-visible bg-transparent p-0 text-fg backdrop:animate-fade-in backdrop:bg-backdrop max-sm:mb-0 max-sm:h-[88dvh] max-sm:w-full"
    >
      <div
        ref={panelRef}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-window max-sm:rounded-b-none max-sm:border-b-0"
      >
        <div
          data-morph-label
          aria-hidden
          className="pointer-events-none invisible absolute inset-0 grid place-items-center text-sm font-medium"
        >
          Contact me
        </div>
        <ChatHeader
          ref={handleRef}
          status={conversation.status}
          answered={conversation.answered}
          onClose={close}
        />
        <ChatThread conversation={conversation} dockRef={dockRef} />
        <ChatDock
          ref={dockRef}
          conversation={conversation}
          onClose={close}
          onSent={setPlane}
        />
        {plane && <ChatPlane from={plane} onDone={() => setPlane(null)} />}
      </div>
    </dialog>
  );
}
