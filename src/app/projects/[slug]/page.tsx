import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, loadCaseStudy } from "@/lib/content";
import { projects } from "@/lib/projects";
import { CaseStudyHeader } from "@/components/sections/CaseStudyHeader";
import { TechTags } from "@/components/ui/TechTags";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.summary };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const CaseStudy = await loadCaseStudy(slug);

  return (
    <article className="pt-4 pb-10">
      <CaseStudyHeader project={project} />
      <div className="max-w-prose">
        <CaseStudy />
      </div>
      <section aria-labelledby="tech" className="mt-10">
        <h2 id="tech" className="text-base font-semibold">
          Technologies used
        </h2>
        <TechTags tech={project.tech} />
      </section>
    </article>
  );
}
