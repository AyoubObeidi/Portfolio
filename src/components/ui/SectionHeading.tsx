import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  children: ReactNode;
}

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className="font-mono text-xs font-medium tracking-[0.08em] text-fg-subtle uppercase"
    >
      <span aria-hidden="true">[ </span>
      {children}
      <span aria-hidden="true"> ]</span>
    </h2>
  );
}
