import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Traffic for this site, from Vercel Web Analytics.",
};

// Placeholder until the Vercel Web Analytics API is wired up (see CLAUDE.md).
export default function AnalyticsPage() {
  return (
    <>
      <h1 className="text-display font-semibold tracking-[-0.02em]">
        Analytics
      </h1>
      <p className="mt-2 text-base text-fg-muted">
        Visitor stats aren&apos;t connected yet. Once they are, this page will
        show real traffic for this site.
      </p>
    </>
  );
}
