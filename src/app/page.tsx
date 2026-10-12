import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HomeIntro } from "@/components/animation/HomeIntro";
import { Bio } from "@/components/sections/Bio";
import { ContactRow } from "@/components/sections/ContactRow";
import { ContributionGraph } from "@/components/sections/ContributionGraph";
import { ProfileHeader } from "@/components/sections/ProfileHeader";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { SocialCards } from "@/components/sections/SocialCards";
import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: { absolute: "[PLACEHOLDER] Your name" },
  description: "[PLACEHOLDER] One sentence about who you are and what you do.",
};

export default function Home() {
  return (
    <HomeIntro>
      <ProfileHeader />
      <Bio />
      <div className="flex flex-col gap-4">
        <SocialCards />
        <ContactRow />
      </div>
      <section aria-labelledby="skills">
        <SectionHeading id="skills">My skills</SectionHeading>
        <SkillsMarquee />
      </section>
      <section aria-label="GitHub activity">
        <Suspense
          fallback={
            <Panel>
              <p className="text-sm text-fg-muted">
                Loading GitHub activity…
              </p>
            </Panel>
          }
        >
          <ContributionGraph />
        </Suspense>
      </section>
      <p className="text-sm text-fg-muted">
        Want the longer story?{" "}
        <Link
          href="/projects"
          className="font-medium text-fg underline underline-offset-4"
        >
          View projects
        </Link>
      </p>
    </HomeIntro>
  );
}
