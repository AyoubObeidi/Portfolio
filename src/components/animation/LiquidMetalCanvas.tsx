"use client";

import { LiquidMetal } from "@paper-design/shaders-react";
import { useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function readToken(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// Only ever rendered on the client (loaded with ssr: false), so reading tokens here is safe.
// Flows constantly; under reduced motion it holds a still frame (speed 0 stops the render loop).
// The shader also pauses itself while off-screen or in a hidden tab.
export function LiquidMetalCanvas() {
  const [colors] = useState(() => ({
    back: readToken("--color-chrome-mid"),
    tint: readToken("--color-chrome-light"),
  }));
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    () => true,
  );

  return (
    <LiquidMetal
      className="absolute inset-0 transition-opacity duration-300 ease-out starting:opacity-0"
      colorBack={colors.back}
      colorTint={colors.tint}
      shape="none"
      scale={1}
      worldWidth={0}
      worldHeight={0}
      repetition={1.5}
      softness={0.05}
      shiftRed={0.3}
      shiftBlue={0.3}
      distortion={0.1}
      contour={0.4}
      angle={90}
      speed={reduceMotion ? 0 : 1}
    />
  );
}
