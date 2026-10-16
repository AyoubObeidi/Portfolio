import type { Metadata } from "next";
import { profile } from "./profile";

// SITE_URL wins once a custom domain is set; otherwise Vercel's production URL, then local dev.
function resolveSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteUrl = new URL(resolveSiteUrl());

export const siteTitle = `${profile.name} · ${profile.role}`;

export const siteDescription =
  "Ayoub Obeidi builds fast, considered interfaces for the web, mostly with React and Next.js.";

interface PageMetadataOptions {
  // Omit for the home page, which uses the full site title.
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article";
}

// Open Graph and Twitter fields replace the layout's rather than merging, so each page sets them all.
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: PageMetadataOptions): Metadata {
  const fullTitle = title ? `${title} · ${profile.name}` : siteTitle;

  return {
    title: title ?? { absolute: siteTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: profile.name,
      locale: "en_US",
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
