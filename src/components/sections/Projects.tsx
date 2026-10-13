import Link from "next/link";
import { projects } from "@/lib/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <section aria-labelledby="projects">
      <SectionHeading id="projects">My projects</SectionHeading>
      <ul className="flex flex-col gap-4">
        {projects.map((project) => (
          <li key={project.repo}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-fg-muted">
        Want the longer story?{" "}
        <Link
          href="/projects"
          className="font-medium text-fg underline underline-offset-4"
        >
          View projects
        </Link>
      </p>
    </section>
  );
}
