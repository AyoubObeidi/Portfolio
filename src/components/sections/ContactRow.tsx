import { profile } from "@/lib/profile";
import { IconButton } from "@/components/ui/IconButton";
import { UiIcon } from "@/components/ui/UiIcon";

export function ContactRow() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${profile.email}`}
        className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-3 text-xs font-semibold transition-colors hover:border-border-strong"
      >
        <UiIcon name="mail" />
        Email me
      </a>
      <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
      <ul className="flex flex-wrap gap-2">
        {profile.links.map((link) => (
          <li key={link.label}>
            <IconButton href={link.href} label={link.label} icon={link.icon} />
          </li>
        ))}
      </ul>
    </div>
  );
}
