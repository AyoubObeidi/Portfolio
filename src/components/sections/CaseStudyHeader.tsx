import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ProjectLinks } from "./ProjectLinks";

interface CaseStudyHeaderProps {
  project: Project;
}

export function CaseStudyHeader({ project }: CaseStudyHeaderProps) {
  return (
    <header>
      <Link
        href="/projects"
        className="text-sm text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
      >
        All projects
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        {project.name}
      </h1>
      <p className="mt-2 max-w-prose text-sm text-fg-muted">
        {project.summary}
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-xs text-fg-subtle">Role</dt>
            <dd className="font-medium">{project.role}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Year</dt>
            <dd className="font-medium">{project.year}</dd>
          </div>
        </dl>
        <ProjectLinks project={project} />
      </div>
      <Image
        src={project.image.src}
        alt={project.image.alt}
        width={1280}
        height={800}
        sizes="(min-width: 42rem) 42rem, 100vw"
        preload
        className="mt-6 aspect-16/10 w-full rounded-md border border-border object-cover object-top"
      />
    </header>
  );
}
