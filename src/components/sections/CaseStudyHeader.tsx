import Link from "next/link";
import type { Project } from "@/lib/projects";
import { PageIntro } from "@/components/animation/PageIntro";
import { ScreenshotFrame } from "@/components/ui/ScreenshotFrame";
import { ProjectLinks } from "./ProjectLinks";

interface CaseStudyHeaderProps {
  project: Project;
}

export function CaseStudyHeader({ project }: CaseStudyHeaderProps) {
  return (
    <header>
      <PageIntro>
        <Link
          href="/projects"
          className="link-underline text-sm text-fg-muted transition-colors hover:text-fg"
        >
          All projects
        </Link>
        <h1 className="mt-6 text-display font-semibold tracking-[-0.02em]">
          {project.name}
        </h1>
        <p className="mt-2 max-w-prose text-base leading-[1.65] text-fg-muted">
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
        <div className="mt-6">
          <ScreenshotFrame
            src={project.image.src}
            alt={project.image.alt}
            url={project.live}
            sizes="(min-width: 42.5rem) 36.5rem, 86vw"
            preload
          />
        </div>
      </PageIntro>
    </header>
  );
}
