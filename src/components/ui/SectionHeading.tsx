import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  children: ReactNode;
}

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className="relative mb-4 inline-block px-2 py-0.5 text-base font-medium text-fg before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:border-y before:border-l before:border-fg-subtle before:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-1.5 after:border-y after:border-r after:border-fg-subtle after:content-['']"
    >
      {children}
    </h2>
  );
}
