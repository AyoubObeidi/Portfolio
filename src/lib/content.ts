import type { MDXContent } from "mdx/types";
import { projects, type Project } from "@/lib/projects";

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

// Each project's case study lives in content/projects/<slug>.mdx.
export async function loadCaseStudy(slug: string): Promise<MDXContent> {
  const caseStudy: { default: MDXContent } = await import(
    `../../content/projects/${slug}.mdx`
  );
  return caseStudy.default;
}
