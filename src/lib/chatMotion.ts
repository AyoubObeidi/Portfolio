import { gsap } from "@/lib/gsap";
import { MOTION_OK, REDUCED_MOTION } from "@/lib/motion";
import type { Origin } from "@/lib/useConversation";

// Entrance for anything new in the chat thread. Call inside useGSAP so it's reverted on unmount.
// With an origin it's an answer: it travels (FLIP) from where it was picked or typed.
// Otherwise it rises into place. Reduced motion: a plain fade.
export function enterThread(el: HTMLElement, origin?: Origin) {
  const thread = el.closest<HTMLElement>("[data-thread]");
  // Scroll first so the FLIP measures the bubble's final on-screen spot.
  if (thread) thread.scrollTop = thread.scrollHeight;

  const mm = gsap.matchMedia();
  mm.add(REDUCED_MOTION, () => {
    gsap.from(el, { autoAlpha: 0, duration: 0.2 });
  });
  mm.add(MOTION_OK, () => {
    if (origin) {
      const to = el.getBoundingClientRect();
      gsap.from(el, {
        x: origin.left - to.left,
        y: origin.top - to.top,
        autoAlpha: 0.6,
        duration: 0.32,
        ease: "ui-move",
      });
      return;
    }
    gsap.from(el, {
      y: 8,
      scale: 0.97,
      autoAlpha: 0,
      duration: 0.25,
      ease: "ui-out",
    });
  });
}
