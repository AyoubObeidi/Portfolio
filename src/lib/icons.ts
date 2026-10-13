import type { SimpleIcon } from "simple-icons";

export type BrandIconData = Pick<SimpleIcon, "title" | "path"> &
  Partial<Pick<SimpleIcon, "hex">>;

// Highest luminance that still gives 3:1 contrast (WCAG non-text) against --color-bg (#fafaf9, L≈0.955).
const MAX_LUMINANCE = 0.285;

function luminance([r, g, b]: number[]) {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

// Brand color, darkened toward black just enough to stay visible on the light background.
export function readableBrandColor(hex: string) {
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  for (let mix = 0; mix <= 1; mix += 0.05) {
    const blended = rgb.map((c) => Math.round(c * (1 - mix)));
    if (luminance(blended) <= MAX_LUMINANCE) return `rgb(${blended.join(" ")})`;
  }
  return undefined;
}

// LinkedIn isn't in simple-icons (removed at LinkedIn's request), so it's inlined here.
export const linkedinIcon: BrandIconData = {
  title: "LinkedIn",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};
