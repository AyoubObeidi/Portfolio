import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I've built: a learning platform, a private CV builder and a retail surveillance system.",
};

export default function ProjectsPage() {
  return (
    <section aria-labelledby="projects" className="pt-4">
      <SectionHeading id="projects" as="h1">
        My projects
      </SectionHeading>
      <ul className="flex flex-col gap-4">
        {projects.map((project) => (
          <li key={project.repo}>
            <ProjectCard project={project} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </section>
  );
}
