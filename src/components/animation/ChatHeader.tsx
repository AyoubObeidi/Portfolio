"use client";

import Image from "next/image";
import type { Ref } from "react";
import { STEPS, firstName } from "@/lib/contact";
import { profile } from "@/lib/profile";
import type { ChatStatus } from "@/lib/useConversation";

interface ChatHeaderProps {
  status: ChatStatus;
  // Number of questions answered, for the progress bars.
  answered: number;
  onClose: () => void;
  // Drag handle for the bottom-sheet layout.
  ref?: Ref<HTMLElement>;
}

const STATUS_TEXT: Record<ChatStatus, string> = {
  idle: "Open to new work · replies within a day",
  typing: "typing…",
  sent: "Message delivered",
};

export function ChatHeader({ status, answered, onClose, ref }: ChatHeaderProps) {
  return (
    <header
      ref={ref}
      data-chat-part
      className="relative border-b border-border px-4 pt-3.5 pb-3 max-sm:cursor-grab max-sm:touch-none"
    >
      <div
        aria-hidden
        className="mx-auto -mt-1 mb-2.5 hidden h-1 w-9 rounded-full bg-border-strong max-sm:block"
      />
      {/* Room for the close button; the progress bars below run full width. */}
      <div className="flex items-center gap-3 pr-9">
        <div className="relative size-9.5 shrink-0">
          {profile.avatar ? (
            <Image
              src={profile.avatar.src}
              alt=""
              width={38}
              height={38}
              unoptimized
              className="size-full rounded-full border border-border bg-surface-raised object-cover [image-rendering:pixelated]"
            />
          ) : (
            <span className="grid size-full place-items-center rounded-full border border-border bg-surface-raised font-semibold text-fg-muted">
              {profile.name[0]}
            </span>
          )}
          <span
            aria-hidden
            className="absolute -right-px -bottom-px size-2.75 rounded-full border-2 border-surface bg-success-dot"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="contact-chat-title" className="text-md font-semibold">
            {firstName(profile.name)}
          </h2>
          {/* Crossfades between states; the conversation log announces the same things. */}
          <p aria-hidden className="relative h-5 text-meta text-fg-muted">
            {(Object.keys(STATUS_TEXT) as ChatStatus[]).map((s) => (
              <span
                key={s}
                data-active={s === status}
                className="absolute inset-0 truncate transition-[opacity,translate] duration-200 ease-out data-[active=false]:translate-y-1 data-[active=false]:opacity-0 motion-reduce:translate-y-0"
              >
                {STATUS_TEXT[s]}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div aria-hidden className="mt-3 grid grid-cols-4 gap-1">
        {STEPS.map((step, i) => (
          <span
            key={step.key}
            className="h-0.75 overflow-hidden rounded-full bg-surface-raised"
          >
            <span
              data-done={i < answered}
              className="block h-full origin-left scale-x-0 bg-fg transition-transform duration-300 ease-out data-[done=true]:scale-x-100 motion-reduce:transition-none"
            />
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 grid size-8 cursor-pointer max-sm:top-5 max-sm:right-1.5 max-sm:size-11 place-items-center rounded-lg text-fg-muted transition-colors duration-150 hover:bg-surface-raised hover:text-fg"
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="size-4"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </header>
  );
}
