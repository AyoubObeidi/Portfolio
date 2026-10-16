import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/projects",
    ...projects.map(({ slug }) => `/projects/${slug}`),
    "/analytics",
  ];

  return paths.map((path) => ({ url: new URL(path, siteUrl).href }));
}
