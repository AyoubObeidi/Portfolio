import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { TechTags } from "@/components/ui/TechTags";
import { ProjectLinks } from "./ProjectLinks";

interface ProjectCardProps {
  project: Project;
  headingLevel?: "h2" | "h3";
}

export function ProjectCard({
  project,
  headingLevel: Heading = "h3",
}: ProjectCardProps) {
  const Subheading = Heading === "h2" ? "h3" : "h4";

  return (
    <article className="flex flex-col gap-4 border border-dashed border-border p-4 sm:flex-row">
      <Image
        src={project.image.src}
        alt={project.image.alt}
        width={1280}
        height={800}
        sizes="(min-width: 640px) 240px, 100vw"
        className="aspect-16/10 w-full shrink-0 rounded-md border border-border object-cover object-top sm:w-60 sm:self-center"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Heading className="text-base font-semibold">
            <Link
              href={`/projects/${project.slug}`}
              className="underline-offset-4 hover:underline"
            >
              {project.name}
            </Link>
          </Heading>
          <ProjectLinks project={project} showCaseStudy />
        </div>
        <p className="mt-2 text-sm text-fg-muted">{project.description}</p>
        <Subheading className="mt-3 text-xs font-semibold">
          Technologies used
        </Subheading>
        <TechTags tech={project.tech} />
      </div>
    </article>
  );
}
