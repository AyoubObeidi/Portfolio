import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/animation/PageIntro";
import { Bio } from "@/components/sections/Bio";
import { ContactRow } from "@/components/sections/ContactRow";
import {
  ContributionGraph,
  GITHUB_HEADING_ID,
} from "@/components/sections/ContributionGraph";
import { Projects } from "@/components/sections/Projects";
import { ProfileHeader } from "@/components/sections/ProfileHeader";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PersonJsonLd } from "@/components/ui/PersonJsonLd";
import { pageMetadata, siteDescription } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  description: siteDescription,
  path: "/",
});

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <PageIntro className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <ProfileHeader />
          <Bio />
          <ContactRow />
        </div>
        <section aria-labelledby="skills">
          <SectionHeader id="skills" title="Skills" />
          <SkillsMarquee />
        </section>
        <section aria-labelledby={GITHUB_HEADING_ID}>
          <Suspense
            fallback={
              <>
                <SectionHeader id={GITHUB_HEADING_ID} title="GitHub" />
                <Panel>
                  <p className="text-sm text-fg-muted">
                    Loading GitHub activity…
                  </p>
                </Panel>
              </>
            }
          >
            <ContributionGraph />
          </Suspense>
        </section>
        <Projects />
      </PageIntro>
    </>
  );
}
