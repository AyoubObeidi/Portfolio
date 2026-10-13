import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";

interface SectionHeaderProps {
  id: string;
  title: ReactNode;
  // Shown at the right end of the row, e.g. a total or an "All projects" link.
  aside?: ReactNode;
}

export function SectionHeader({ id, title, aside }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <SectionHeading id={id}>{title}</SectionHeading>
      {aside}
    </div>
  );
}
