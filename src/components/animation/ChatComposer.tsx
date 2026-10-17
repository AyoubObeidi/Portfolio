"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { STEPS, isValidAnswer, maxLength } from "@/lib/contact";
import { gsap, useGSAP } from "@/lib/gsap";
import { isPhone, prefersReducedMotion } from "@/lib/motion";
import type { Origin } from "@/lib/useConversation";

interface ChatComposerProps {
  step: number;
  value: string;
  onChange: (value: string) => void;
  // False while Ayoub is still typing the question; typing ahead is allowed.
  canSubmit: boolean;
  onAnswer: (text: string, origin: Origin) => void;
}

const FIELD =
  // The rounded wrapper draws the focus ring, so the field skips the global one.
  "block w-full resize-none bg-transparent px-3.5 py-2.25 text-sm/5 text-fg outline-none! placeholder:text-fg-subtle";

// Keyed by step in ChatDock, so each question gets a fresh composer.
export function ChatComposer({
  step,
  value,
  onChange,
  canSubmit,
  onAnswer,
}: ChatComposerProps) {
  const scope = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [tried, setTried] = useState(false);
  const { contextSafe } = useGSAP({ scope });
  const cfg = STEPS[step];
  const valid = isValidAnswer(cfg.key, value);
  const showError = tried && !valid;
  const hintId = `contact-hint-${cfg.key}`;

  const field = () => (cfg.multiline ? textRef.current : inputRef.current);

  // Focus once per question (only one of the two fields is rendered).
  useEffect(() => {
    const el = textRef.current ?? inputRef.current;
    if (el?.closest("dialog")?.open) el.focus({ preventScroll: true });
  }, []);

  // The message box grows with its text, up to a limit.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [value]);

  const submit = (event?: FormEvent) => contextSafe(() => {
    event?.preventDefault();
    if (!canSubmit) return;
    const el = field();
    if (!el) return;
    const reduce = prefersReducedMotion();
    if (!valid) {
      setTried(true);
      el.focus();
      if (!reduce)
        gsap.fromTo(
          "[data-field]",
          { x: 0 },
          { keyframes: { x: [-6, 6, -4, 4, 0] }, duration: 0.3, ease: "none" },
        );
      return;
    }
    // Press feedback for Enter, which doesn't trigger :active.
    if (!reduce)
      gsap.fromTo(
        "[data-send]",
        { scale: 0.94 },
        { scale: 1, duration: 0.16, ease: "ui-out" },
      );
    onAnswer(value.trim(), el.getBoundingClientRect());
  })();

  const shared = {
    id: `contact-${cfg.key}`,
    name: cfg.key,
    value,
    placeholder: cfg.placeholder,
    maxLength: maxLength(cfg.key),
    "aria-invalid": showError || undefined,
    "aria-describedby": hintId,
    className: FIELD,
  };

  return (
    <form ref={scope} onSubmit={submit} noValidate>
      <label htmlFor={shared.id} className="sr-only">
        {cfg.label}
      </label>
      <div className="flex items-end gap-2">
        <div
          data-field
          data-invalid={showError}
          className="min-w-0 flex-1 rounded-[1.25rem] border border-border-control bg-surface transition-colors duration-150 focus-within:border-transparent focus-within:outline-2 focus-within:outline-focus data-[invalid=true]:border-danger-fg"
        >
          {cfg.multiline ? (
            <textarea
              ref={textRef}
              {...shared}
              rows={1}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                // Enter sends on desktop; phones keep Enter for new lines.
                if (e.key === "Enter" && !e.shiftKey && !isPhone()) submit(e);
              }}
              className={`${FIELD} max-h-35`}
            />
          ) : (
            <input
              ref={inputRef}
              {...shared}
              type={cfg.inputType ?? "text"}
              inputMode={cfg.inputType === "email" ? "email" : "text"}
              autoComplete={cfg.autoComplete ?? "off"}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </div>
        <button
          type="submit"
          data-send
          data-armed={valid}
          aria-label="Send answer"
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-surface-raised text-fg-subtle transition-[background-color,color,scale] duration-150 ease-out active:scale-94 data-[armed=true]:bg-fg data-[armed=true]:text-on-fg"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4.5"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
      <p
        id={hintId}
        aria-live="polite"
        className="mx-1 mt-2 min-h-4.5 text-meta/4.5 text-fg-subtle data-[error=true]:text-danger-fg"
        data-error={showError}
      >
        {showError ? (
          cfg.error
        ) : cfg.multiline ? (
          <span className="max-sm:hidden">
            Enter to send · Shift+Enter for a new line
          </span>
        ) : null}
      </p>
    </form>
  );
}
