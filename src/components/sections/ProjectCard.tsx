import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
}

// Compact card for the home page; the whole card links to the case study.
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-wrap gap-5 rounded-xl border border-border bg-surface p-4 transition-colors has-[a:focus-visible]:border-border-strong has-[a:hover]:border-border-strong">
      <div className="aspect-16/10 w-full shrink-0 grow basis-50 overflow-hidden rounded-lg border border-border sm:max-w-60">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={1280}
          height={800}
          sizes="(min-width: 640px) 240px, 100vw"
          className="size-full object-cover object-top transition-[scale,filter] duration-200 ease-(--ease-out) group-has-[a:focus-visible]:grayscale-0 group-has-[a:hover]:grayscale-0 motion-safe:group-has-[a:focus-visible]:scale-[1.04] motion-safe:group-has-[a:hover]:scale-[1.04] [@media(hover:hover)]:grayscale"
        />
      </div>
      <div className="flex min-w-0 grow basis-65 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-card font-semibold tracking-[-0.01em]">
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:rounded-xl"
            >
              {project.name}
            </Link>
          </h3>
          <span className="font-mono text-xs text-fg-subtle">
            {project.year}
          </span>
        </div>
        <p className="text-sm leading-[1.6] text-pretty text-fg-muted">
          {project.summary}
        </p>
        <p className="mt-auto font-mono text-xs text-fg-subtle">
          {project.tech.slice(0, 4).join(" · ")}
        </p>
      </div>
    </article>
  );
}
