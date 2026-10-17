// Browser-only helpers for motion decisions made inside event handlers.
// For setup code, prefer gsap.matchMedia() with these same queries.

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
// Matches Tailwind's max-sm variant.
const PHONE = "(width < 40rem)";

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export function isPhone() {
  return window.matchMedia(PHONE).matches;
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
