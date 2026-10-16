import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ScreenshotFrame } from "@/components/ui/ScreenshotFrame";
import { TechTags } from "@/components/ui/TechTags";
import { ProjectLinks } from "./ProjectLinks";

interface ProjectEntryProps {
  project: Project;
  number: number;
}

// Full-width entry on the /projects page.
export function ProjectEntry({ project, number }: ProjectEntryProps) {
  return (
    <article className="group flex flex-col gap-5">
      {/* Mouse shortcut to the case study; keyboard users get the "Case study" link below.
          Hovering anywhere on the entry, or focusing one of its links, lifts the window. */}
      <Link
        href={`/projects/${project.slug}`}
        tabIndex={-1}
        className="rounded-xl"
      >
        <ScreenshotFrame
          src={project.image.src}
          alt={project.image.alt}
          url={project.live}
          sizes="(min-width: 42.5rem) 36.5rem, 86vw"
          preload={number === 1}
          lift
        />
      </Link>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <div className="flex items-baseline gap-3">
          <span aria-hidden="true" className="font-mono text-xs text-fg-subtle">
            {String(number).padStart(2, "0")}
          </span>
          <h2 className="text-title font-semibold tracking-[-0.02em]">
            {project.name}
          </h2>
        </div>
        <ProjectLinks project={project} showCaseStudy />
      </div>
      <p className="text-base leading-[1.65] text-pretty text-fg-body">
        {project.description}
      </p>
      <TechTags tech={project.tech} />
    </article>
  );
}
