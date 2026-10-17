import { profile } from "@/lib/profile";
import { ContactButton } from "@/components/ui/ContactButton";
import { LinkButton } from "@/components/ui/LinkButton";

export function ContactRow() {
  return (
    <ul className="flex flex-wrap gap-2">
      <li>
        <ContactButton />
      </li>
      {profile.links.map((link) => (
        <li key={link.label}>
          <LinkButton href={link.href}>{link.label}</LinkButton>
        </li>
      ))}
    </ul>
  );
}
