"use client";

import dynamic from "next/dynamic";

const LiquidMetalCanvas = dynamic(
  () => import("./LiquidMetalCanvas").then((m) => m.LiquidMetalCanvas),
  { ssr: false },
);

// Fills its parent link behind the button face, so only a thin rim shows.
// The CSS chrome underneath covers no-JS, loading, and missing WebGL.
export function LiquidMetalRim() {
  return (
    <span
      aria-hidden
      className="bg-liquid-metal absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
    >
      <LiquidMetalCanvas />
    </span>
  );
}
