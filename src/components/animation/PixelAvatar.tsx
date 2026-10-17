"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface PixelAvatarProps {
  src: string;
  alt: string;
  // Animated version of src; shown unless the visitor prefers reduced motion.
  animatedSrc?: string;
  // Low-res copies of src, coarsest first, drawn over it and removed one by one.
  pixelSteps: string[];
  size: number;
}

// Seconds between resolution steps.
const STEP = 0.13;

// Resolves from big pixels to the full image on load, and again on hover.
// The pixel layers are hidden by default, so without JS (or with reduced motion) it's just the photo.
export function PixelAvatar({
  src,
  alt,
  animatedSrc,
  pixelSteps,
  size,
}: PixelAvatarProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-pixel]", scope.current);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const resolve = (delay: number) => {
          const tl = gsap.timeline({ delay });
          tl.set(layers, { autoAlpha: 1 });
          layers.forEach((layer, i) => tl.set(layer, { autoAlpha: 0 }, (i + 1) * STEP));
          return tl;
        };

        // Runs before PageIntro's effect, so the layers are up before the header fades in.
        gsap.set(layers, { autoAlpha: 1 });
        let current = resolve(0.25);

        const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
        const replay = contextSafe!(() => {
          if (!hoverQuery.matches || current.isActive()) return;
          current = resolve(0);
        });

        const el = scope.current;
        el?.addEventListener("pointerenter", replay);
        return () => el?.removeEventListener("pointerenter", replay);
      });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="relative shrink-0 overflow-hidden rounded-xl"
      style={{ width: size, height: size }}
    >
      <picture>
        {animatedSrc && (
          <source
            srcSet={animatedSrc}
            type="image/webp"
            media="(prefers-reduced-motion: no-preference)"
          />
        )}
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          unoptimized
          className="size-full object-cover [image-rendering:pixelated]"
        />
      </picture>
      {pixelSteps.map((step, i) => (
        <Image
          key={step}
          data-pixel
          style={{ zIndex: pixelSteps.length - i }}
          src={step}
          alt=""
          aria-hidden="true"
          width={size}
          height={size}
          unoptimized
          className="invisible absolute inset-0 size-full [image-rendering:pixelated]"
        />
      ))}
    </div>
  );
}
