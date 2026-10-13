import { profile } from "@/lib/profile";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { LinkButton } from "@/components/ui/LinkButton";
import { Panel } from "@/components/ui/Panel";
import { UiIcon } from "@/components/ui/UiIcon";

export function Footer() {
  return (
    <footer aria-labelledby="contact" className="mt-16 pb-16">
      <Panel className="flex flex-col items-center gap-5 px-6 py-10 text-center">
        <div className="flex flex-col gap-2">
          <h2
            id="contact"
            className="text-title font-semibold tracking-[-0.02em]"
          >
            Contact me
          </h2>
          <p className="text-md text-pretty text-fg-muted">
            Have a project or a role in mind? I usually reply within a day.
          </p>
        </div>
        <ul className="flex flex-wrap justify-center gap-2">
          {profile.links.map((link) => (
            <li key={link.label}>
              <LinkButton
                href={link.href}
                icon={<BrandIcon icon={link.icon} className="size-3.75" />}
              >
                {link.label}
              </LinkButton>
            </li>
          ))}
          {profile.resume && (
            <li>
              <LinkButton href={profile.resume} icon={<UiIcon name="file" />}>
                Resume
              </LinkButton>
            </li>
          )}
          <li>
            <LinkButton href={`mailto:${profile.email}`} variant="primary">
              Email me
            </LinkButton>
          </li>
        </ul>
      </Panel>
    </footer>
  );
}
