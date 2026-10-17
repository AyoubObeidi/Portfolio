import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/lib/profile";

// Opens the contact chat (ContactDialog). Without JS it's a plain email link.
export function ContactButton() {
  return (
    <LinkButton
      href={`mailto:${profile.email}`}
      variant="primary"
      opensDialog="contact"
    >
      Contact me
    </LinkButton>
  );
}
