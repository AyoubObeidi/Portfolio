"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LiquidMetalCanvas = dynamic(
  () => import("./LiquidMetalCanvas").then((m) => m.LiquidMetalCanvas),
  { ssr: false },
);

// Resolves once the page has loaded and the main thread is idle, so the shader
// never competes with hydration or the page-load sequence.
function whenIdle(callback: () => void) {
  // Safari has no requestIdleCallback.
  const hasIdle = typeof requestIdleCallback === "function";
  let handle = 0;
  const schedule = () => {
    handle = hasIdle
      ? requestIdleCallback(callback, { timeout: 2000 })
      : window.setTimeout(callback, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    window.removeEventListener("load", schedule);
    if (hasIdle) cancelIdleCallback(handle);
    else window.clearTimeout(handle);
  };
}

// Fills its parent link behind the button face, so only a thin rim shows.
// The CSS chrome underneath covers no-JS, loading, and missing WebGL.
export function LiquidMetalRim() {
  const [ready, setReady] = useState(false);

  useEffect(() => whenIdle(() => setReady(true)), []);

  return (
    <span
      aria-hidden
      className="bg-liquid-metal absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
    >
      {ready && <LiquidMetalCanvas />}
    </span>
  );
}
