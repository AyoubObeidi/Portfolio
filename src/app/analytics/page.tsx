import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/animation/PageIntro";
import { AnalyticsFallback } from "@/components/sections/AnalyticsFallback";
import { AnalyticsReport } from "@/components/sections/AnalyticsReport";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Analytics",
  description: "Real traffic for this site, from Vercel Web Analytics.",
  path: "/analytics",
});

export default function AnalyticsPage({ searchParams }: PageProps<"/analytics">) {
  return (
    <PageIntro>
      <h1 className="text-display font-semibold tracking-[-0.02em]">
        Analytics
      </h1>
      <p className="mt-2 text-base text-fg-muted">
        Real traffic for this site, straight from Vercel Web Analytics.
        Updated every 30 minutes.
      </p>
      <div className="mt-8">
        <Suspense fallback={<AnalyticsFallback />}>
          <AnalyticsReport searchParams={searchParams} />
        </Suspense>
      </div>
    </PageIntro>
  );
}
