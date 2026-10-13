import { siGithub } from "simple-icons";
import type { Project } from "@/lib/projects";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { LinkButton } from "@/components/ui/LinkButton";
import { UiIcon } from "@/components/ui/UiIcon";

interface ProjectLinksProps {
  project: Project;
  // Adds a "Case study" button; off on the case-study page itself.
  showCaseStudy?: boolean;
}

export function ProjectLinks({ project, showCaseStudy }: ProjectLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {showCaseStudy && (
        <LinkButton
          href={`/projects/${project.slug}`}
          label={`${project.name} case study`}
          icon={<UiIcon name="file" className="size-3" />}
        >
          Case study
        </LinkButton>
      )}
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
  );
}
