import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { isPhone } from "@/lib/motion";

// A flick faster than this (px/ms) dismisses even when the drag was short.
const FLICK_VELOCITY = 0.11;
// Dragging past this share of the sheet's height dismisses on release.
const DISMISS_SHARE = 0.25;

// Drag-to-dismiss for the dialog's bottom-sheet layout on phones.
// The handle follows the finger; release either settles back or slides out and closes.
export function useSheetDrag(
  dialogRef: RefObject<HTMLDialogElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
  handleRef: RefObject<HTMLElement | null>,
) {
  useGSAP(
    (_, contextSafe) => {
      const handle = handleRef.current;
      const panel = panelRef.current;
      if (!handle || !panel || !contextSafe) return;
      let drag: { id: number; y0: number; t0: number; dy: number } | null =
        null;

      const down = contextSafe((e: PointerEvent) => {
        // One pointer at a time, and leave the close button alone.
        if (!isPhone() || drag || (e.target as Element).closest("button"))
          return;
        drag = { id: e.pointerId, y0: e.clientY, t0: performance.now(), dy: 0 };
        handle.setPointerCapture(e.pointerId);
        gsap.killTweensOf(panel);
      });

      const move = contextSafe((e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return;
        let dy = e.clientY - drag.y0;
        // Friction above the resting edge rather than a hard stop.
        if (dy < 0) dy = -Math.sqrt(-dy) * 2;
        drag.dy = dy;
        gsap.set(panel, { y: dy });
      });

      const end = contextSafe((e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return;
        const { dy, t0 } = drag;
        drag = null;
        const velocity = dy / (performance.now() - t0);
        if (dy > panel.offsetHeight * DISMISS_SHARE || velocity > FLICK_VELOCITY) {
          gsap.to(panel, {
            y: panel.offsetHeight,
            duration: 0.2,
            ease: "ui-out",
            onComplete: () => dialogRef.current?.close(),
          });
        } else {
          gsap.to(panel, { y: 0, duration: 0.3, ease: "drawer" });
        }
      });

      handle.addEventListener("pointerdown", down);
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
      return () => {
        handle.removeEventListener("pointerdown", down);
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
      };
    },
    { scope: panelRef },
  );
}
