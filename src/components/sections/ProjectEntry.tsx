import Image from "next/image";
import type { Project } from "@/lib/projects";
import { TechTags } from "@/components/ui/TechTags";
import { ProjectLinks } from "./ProjectLinks";

interface ProjectEntryProps {
  project: Project;
  number: number;
}

// Full-width entry on the /projects page.
export function ProjectEntry({ project, number }: ProjectEntryProps) {
  return (
    <article className="flex flex-col gap-5">
      <Image
        src={project.image.src}
        alt={project.image.alt}
        width={1280}
        height={720}
        sizes="(min-width: 42.5rem) 42.5rem, 100vw"
        className="aspect-video w-full rounded-xl border border-border object-cover object-top"
      />
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
