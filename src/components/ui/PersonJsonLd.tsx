import { profile } from "@/lib/profile";
import { siteDescription, siteUrl } from "@/lib/site";

// schema.org Person data so search engines can link the site to its owner's profiles.
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: siteDescription,
    url: siteUrl.href,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: profile.links.map((link) => link.href),
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can't close the script tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
