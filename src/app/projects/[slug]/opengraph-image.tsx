import { ImageResponse } from "next/og";
import { getProject } from "@/lib/content";

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse can't read CSS variables, so these mirror --color-bg, --color-fg,
// --color-fg-muted and --color-border in globals.css.
const colors = {
  bg: "#fafafa",
  fg: "#171717",
  muted: "#525252",
  border: "#e0e0e0",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: colors.bg,
          color: colors.fg,
          border: `16px solid ${colors.border}`,
        }}
      >
        <div style={{ fontSize: 28, color: colors.muted }}>Case study</div>
        <div style={{ fontSize: 80, fontWeight: 600, marginTop: 12 }}>
          {project?.name ?? "Project"}
        </div>
        <div
          style={{
            fontSize: 34,
            color: colors.muted,
            marginTop: 20,
            maxWidth: 900,
          }}
        >
          {project?.summary ?? ""}
        </div>
      </div>
    ),
    size,
  );
}
