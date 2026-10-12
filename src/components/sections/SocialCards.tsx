import { profile } from "@/lib/profile";
import { cn, externalLinkProps } from "@/lib/utils";
import { BrandIcon } from "@/components/ui/BrandIcon";

export function SocialCards() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {profile.socialCards.map((card) => (
        <li
          key={card.icon.title}
          className="flex items-center gap-3 border border-dashed border-border p-3"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface-raised text-fg">
            <BrandIcon icon={card.icon} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              {card.title}
            </span>
            <span className="block truncate text-xs text-fg-muted">
              {card.subtitle}
            </span>
          </span>
          <a
            href={card.href}
            aria-label={`${card.action} ${card.title} on ${card.icon.title}`}
            {...externalLinkProps(card.href)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-85",
              card.variant === "accent"
                ? "bg-accent text-on-accent"
                : "border border-border bg-surface-raised text-fg",
            )}
          >
            {card.action}
          </a>
        </li>
      ))}
    </ul>
  );
}
