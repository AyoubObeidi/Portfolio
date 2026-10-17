import { useEffect, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { isPhone, prefersReducedMotion } from "@/lib/motion";

// The phone bottom sheet is only as tall as the conversation.
// This keeps it above the on-screen keyboard and eases it taller as messages arrive.
export function useSheetFit(
  dialogRef: RefObject<HTMLDialogElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
) {
  // The keyboard shrinks the visual viewport, not the layout one, so dvh can't see it.
  // --keyboard lifts the sheet and --viewport caps its height (used by ContactDialog's classes).
  useEffect(() => {
    const dialog = dialogRef.current;
    const vv = window.visualViewport;
    if (!dialog || !vv) return;
    const sync = () => {
      const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      dialog.style.setProperty("--keyboard", `${Math.round(keyboard)}px`);
      dialog.style.setProperty("--viewport", `${Math.round(vv.height)}px`);
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
    };
  }, [dialogRef]);

  // When the sheet grows, its top edge would jump up by the new message's height.
  // Start it that far down instead and slide it into place (transform only).
  useGSAP(
    (_, contextSafe) => {
      const dialog = dialogRef.current;
      const panel = panelRef.current;
      if (!dialog || !panel || !contextSafe) return;
      let last = panel.offsetHeight;

      const onResize = contextSafe(() => {
        const height = panel.offsetHeight;
        const grew = height - last;
        last = height;
        // When the keyboard squeezes the sheet, keep the latest question in view.
        const thread = panel.querySelector("[data-thread]");
        if (thread && grew < 0) thread.scrollTop = thread.scrollHeight;
        if (
          grew <= 0 ||
          !dialog.open ||
          !isPhone() ||
          prefersReducedMotion() ||
          // Leave the open, close and drag motion alone.
          gsap.isTweening(panel) ||
          gsap.getProperty(panel, "y") !== 0
        )
          return;
        gsap.fromTo(panel, { y: grew }, { y: 0, duration: 0.3, ease: "drawer" });
      });

      const observer = new ResizeObserver(onResize);
      observer.observe(panel);
      return () => observer.disconnect();
    },
    { scope: panelRef },
  );
}
