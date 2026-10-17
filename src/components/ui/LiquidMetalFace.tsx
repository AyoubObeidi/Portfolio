import { LiquidMetalRim } from "@/components/animation/LiquidMetalRim";

// Liquid-metal rim behind a glossy light face, after Paper Design's chroma-glass buttons.
export function LiquidMetalFace() {
  return (
    <>
      <LiquidMetalRim />
      <span
        aria-hidden
        className="absolute inset-[3px] -z-10 rounded-[calc(var(--radius-lg)-3px)] bg-linear-to-b from-surface to-surface-raised shadow-metal-inset"
      />
    </>
  );
}
