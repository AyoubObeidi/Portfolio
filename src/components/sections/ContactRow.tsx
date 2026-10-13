import { profile } from "@/lib/profile";
import { LinkButton } from "@/components/ui/LinkButton";

export function ContactRow() {
  return (
    <ul className="flex flex-wrap gap-2">
      <li>
        <LinkButton href={`mailto:${profile.email}`} variant="primary">
          Email me
        </LinkButton>
      </li>
      {profile.links.map((link) => (
        <li key={link.label}>
          <LinkButton href={link.href}>{link.label}</LinkButton>
        </li>
      ))}
    </ul>
  );
}
