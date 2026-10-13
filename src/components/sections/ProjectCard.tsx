import Image from "next/image";
import { siGithub } from "simple-icons";
import type { Project } from "@/lib/projects";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { LinkButton } from "@/components/ui/LinkButton";
import { UiIcon } from "@/components/ui/UiIcon";

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
        className="aspect-16/10 w-full shrink-0 self-start rounded-md border border-border object-cover object-top sm:w-60"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Heading className="text-base font-semibold">{project.name}</Heading>
          <div className="flex gap-2">
            {project.live && (
              <LinkButton
                href={project.live}
                label={`${project.name} live site`}
                icon={<UiIcon name="external" className="size-3" />}
              >
                Live
              </LinkButton>
            )}
            <LinkButton
              href={project.repo}
              label={`${project.name} on GitHub`}
              icon={<BrandIcon icon={siGithub} className="size-3" />}
            >
              GitHub
            </LinkButton>
          </div>
        </div>
        <p className="mt-2 text-sm text-fg-muted">{project.description}</p>
        <Subheading className="mt-3 text-xs font-semibold">
          Technologies used
        </Subheading>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-border bg-surface-raised px-2 py-0.5 text-2xs font-medium"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
