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
            className="group link-underline text-sm text-fg-muted transition-colors hover:text-fg"
          >
            All projects{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-0.5"
            >
              →
            </span>
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
