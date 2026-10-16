import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// ImageResponse can't read CSS variables, so these mirror --color-bg, --color-fg,
// --color-fg-muted and --color-border in globals.css.
const colors = {
  bg: "#fafaf9",
  fg: "#1c1c1a",
  muted: "#6b6b66",
  border: "#e8e8e5",
};

interface OgCardOptions {
  kicker: string;
  title: string;
  subtitle: string;
}

export function ogCard({ kicker, title, subtitle }: OgCardOptions) {
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
        <div style={{ fontSize: 28, color: colors.muted }}>{kicker}</div>
        <div style={{ fontSize: 80, fontWeight: 600, marginTop: 12 }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 34,
            color: colors.muted,
            marginTop: 20,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    ogSize,
  );
}
