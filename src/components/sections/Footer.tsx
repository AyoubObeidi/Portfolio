import { profile } from "@/lib/profile";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { LinkButton } from "@/components/ui/LinkButton";
import { Panel } from "@/components/ui/Panel";
import { UiIcon } from "@/components/ui/UiIcon";

export function Footer() {
  return (
    <footer aria-labelledby="contact" className="mt-16 pb-8">
      <Panel className="flex flex-col items-center gap-2 px-4 py-8 text-center">
        <h2 id="contact" className="text-xl font-semibold tracking-tight">
          Contact me
        </h2>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {profile.links.map((link) => (
            <li key={link.label}>
              <LinkButton
                href={link.href}
                icon={<BrandIcon icon={link.icon} className="size-3.5" />}
              >
                {link.label}
              </LinkButton>
            </li>
          ))}
          <li>
            <LinkButton
              href={`mailto:${profile.email}`}
              icon={<UiIcon name="mail" />}
            >
              Email
            </LinkButton>
          </li>
          {profile.resume && (
            <li>
              <LinkButton href={profile.resume} icon={<UiIcon name="file" />}>
                Resume
              </LinkButton>
            </li>
          )}
        </ul>
      </Panel>
    </footer>
  );
}
