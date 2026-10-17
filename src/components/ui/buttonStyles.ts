// Shared by LinkButton and Button so links and buttons look and press the same.
export const BUTTON_BASE =
  "inline-flex h-9 items-center gap-2 rounded-lg text-sm whitespace-nowrap transition-[color,background-color,border-color,translate,scale] duration-150 ease-out motion-safe:hover:-translate-y-px active:translate-y-0 active:scale-97";

export const BUTTON_VARIANTS = {
  primary:
    "relative isolate overflow-hidden px-4 font-medium text-fg shadow-metal",
  outline:
    "border border-border-control bg-surface px-3.5 text-fg hover:border-border-strong",
};

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
