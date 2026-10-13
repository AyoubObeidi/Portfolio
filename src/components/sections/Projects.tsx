import Link from "next/link";
import { projects } from "@/lib/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "./ProjectCard";

const FEATURED_COUNT = 2;

export function Projects() {
  return (
    <section aria-labelledby="selected-work">
      <SectionHeader
        id="selected-work"
        title="Selected work"
        aside={
          <Link
            href="/projects"
            className="text-sm text-fg-muted transition-colors hover:text-fg"
          >
            All projects →
          </Link>
        }
      />
      <ul className="flex flex-col gap-3">
        {projects.slice(0, FEATURED_COUNT).map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
