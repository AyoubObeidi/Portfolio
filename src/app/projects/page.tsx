import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { PageIntro } from "@/components/animation/PageIntro";
import { ProjectEntry } from "@/components/sections/ProjectEntry";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I've built: a learning platform, a private CV builder and a retail surveillance system.",
};

export default function ProjectsPage() {
  return (
    <PageIntro>
      <h1 className="text-display font-semibold tracking-[-0.02em]">
        Projects
      </h1>
      <p className="mt-2 text-base text-fg-muted">
        Things I&apos;ve designed, built and shipped.
      </p>
      <ul className="mt-10 flex flex-col gap-14">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <ProjectEntry project={project} number={i + 1} />
          </li>
        ))}
      </ul>
    </PageIntro>
  );
}
