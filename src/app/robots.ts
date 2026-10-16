import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Preview deployments stay out of search results; only production is indexed.
export default function robots(): MetadataRoute.Robots {
  const isProduction = (process.env.VERCEL_ENV ?? "production") === "production";

  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
