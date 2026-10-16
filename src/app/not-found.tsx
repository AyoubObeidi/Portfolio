import type { Metadata } from "next";
import { PageIntro } from "@/components/animation/PageIntro";
import { LinkButton } from "@/components/ui/LinkButton";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist or has moved.",
};

export default function NotFound() {
  return (
    <PageIntro>
      <h1 className="text-display font-semibold tracking-[-0.02em]">
        Page not found
      </h1>
      <p className="mt-2 max-w-prose text-base text-fg-muted">
        This page doesn&apos;t exist or has moved. Check the address, or pick
        up from one of these.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton href="/" variant="primary">
          Go to the home page
        </LinkButton>
        <LinkButton href="/projects">View projects</LinkButton>
      </div>
    </PageIntro>
  );
}
