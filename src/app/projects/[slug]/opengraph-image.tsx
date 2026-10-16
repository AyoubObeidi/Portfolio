import { getProject } from "@/lib/content";
import { ogCard, ogSize } from "@/lib/og";
import { projects } from "@/lib/projects";

export const alt = "Case study card with the project's name and summary";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  return ogCard({
    kicker: "Case study",
    title: project?.name ?? "Project",
    subtitle: project?.summary ?? "",
  });
}
