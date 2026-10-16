import { profile } from "@/lib/profile";
import { EmailButton } from "@/components/ui/EmailButton";
import { LinkButton } from "@/components/ui/LinkButton";

export function ContactRow() {
  return (
    <ul className="flex flex-wrap gap-2">
      <li>
        <EmailButton />
      </li>
      {profile.links.map((link) => (
        <li key={link.label}>
          <LinkButton href={link.href}>{link.label}</LinkButton>
        </li>
      ))}
    </ul>
  );
}
