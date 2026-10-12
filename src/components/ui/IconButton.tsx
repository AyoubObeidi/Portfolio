import type { BrandIconData } from "@/lib/icons";
import { externalLinkProps } from "@/lib/utils";
import { BrandIcon } from "./BrandIcon";

interface IconButtonProps {
  href: string;
  label: string;
  icon: BrandIconData;
}

export function IconButton({ href, label, icon }: IconButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...externalLinkProps(href)}
      className="grid size-8 place-items-center rounded-md border border-border bg-surface text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
    >
      <BrandIcon icon={icon} className="size-3.5" />
    </a>
  );
}
