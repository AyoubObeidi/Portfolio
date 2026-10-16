import { LinkButton } from "@/components/ui/LinkButton";
import { profile } from "@/lib/profile";
import { gmailComposeUrl } from "@/lib/utils";

// Opens a Gmail compose window addressed to me, in a new tab.
export function EmailButton() {
  return (
    <LinkButton
      href={gmailComposeUrl(profile.email)}
      variant="primary"
      label="Email me (opens Gmail compose in a new tab)"
    >
      Email me
    </LinkButton>
  );
}
