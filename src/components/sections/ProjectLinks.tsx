import Link from "next/link";
import type { Project } from "@/lib/projects";
import { externalLinkProps } from "@/lib/utils";

interface ProjectLinksProps {
  project: Project;
  // Adds a "Case study" link; off on the case-study page itself.
  showCaseStudy?: boolean;
}

const external =
  "group link-underline text-fg-muted transition-colors hover:text-fg";

// Nudges the ↗ toward where the link goes.
function ExternalArrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-px motion-safe:group-hover:-translate-y-px"
    >
      ↗
    </span>
  );
}

export function ProjectLinks({ project, showCaseStudy }: ProjectLinksProps) {
  return (
    <div className="flex gap-4 text-sm">
      {showCaseStudy && (
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.name} case study`}
          className="border-b border-border-strong text-fg transition-colors hover:border-fg"
        >
          Case study
        </Link>
      )}
      {project.live && (
        <a
          href={project.live}
          aria-label={`${project.name} live site (opens in a new tab)`}
          {...externalLinkProps(project.live)}
          className={external}
        >
          Live <ExternalArrow />
        </a>
      )}
      <a
        href={project.repo}
        aria-label={`${project.name} on GitHub (opens in a new tab)`}
        {...externalLinkProps(project.repo)}
        className={external}
      >
        GitHub <ExternalArrow />
      </a>
    </div>
  );
}
