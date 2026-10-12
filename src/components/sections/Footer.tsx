import { profile } from "@/lib/profile";
import { IconButton } from "@/components/ui/IconButton";

export function Footer() {
  return (
    <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border py-8 text-sm text-fg-muted">
      <a
        href={`mailto:${profile.email}`}
        className="underline-offset-4 transition-colors hover:text-fg hover:underline"
      >
        {profile.email}
      </a>
      <ul className="flex gap-2">
        {profile.links.map((link) => (
          <li key={link.label}>
            <IconButton href={link.href} label={link.label} icon={link.icon} />
          </li>
        ))}
      </ul>
    </footer>
  );
}
