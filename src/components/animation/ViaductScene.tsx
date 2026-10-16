"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Sizes are in source pixels of the engraving, scaled by --u (px per source px).
// The train's wheels sink 7px into the deck so it sits on the parapet, not above it.
const scene =
  "relative h-[calc(var(--u)*702)] overflow-hidden [--u:clamp(0.35px,0.11px+0.04vw,0.7px)]";
const viaduct =
  "absolute inset-x-0 bottom-0 h-[calc(var(--u)*366)] bg-[url(/footer/viaduct.webp)] bg-size-[auto_100%] bg-top bg-repeat-x";
const train =
  "absolute bottom-[calc(var(--u)*359)] left-[calc(50%-var(--u)*339)] w-[calc(var(--u)*678)]";
// Smoke and locomotive share one 678×343 canvas; the smoke pivots on the chimney top.
const layer = "block h-auto w-full max-w-none";
const smokeLayer = `${layer} absolute inset-0 origin-[93.5%_61.8%]`;
// The train's rendered width (678 × --u), so phones don't fetch the 1080w file.
const trainSizes =
  "(min-width: 1475px) 475px, (min-width: 600px) calc(27.12vw + 75px), 238px";

// The train rolls left to right across the full-width viaduct, looping while the
// footer is on screen, its smoke billowing as it goes. Without JS or under reduced
// motion it stays parked mid-bridge.
export function ViaductScene() {
  const scope = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = trainRef.current;
        const smoke = smokeRef.current;
        const stage = scope.current;
        if (!el || !smoke || !stage) return;

        // Off the left edge to off the right edge, re-measured every lap so a
        // resize is picked up without restarting.
        const ride = gsap.fromTo(
          el,
          { x: () => -(el.offsetLeft + el.offsetWidth) },
          {
            x: () => stage.clientWidth - el.offsetLeft,
            // Covers its own length every 6s, so it feels the same speed at any size.
            duration: ((stage.clientWidth + el.offsetWidth) / el.offsetWidth) * 6.5,
            ease: "none",
            repeat: -1,
            repeatRefresh: true,
            paused: true,
          },
        );
        // Start from where it's parked so nothing jumps when the loop kicks in.
        ride.progress(
          (el.offsetLeft + el.offsetWidth) / (stage.clientWidth + el.offsetWidth),
        );

        // The plume swells and trails back from the chimney. Stretch and lean run
        // on different periods so the loop never visibly repeats.
        const billow = gsap
          .timeline({ paused: true })
          .to(smoke, {
            scaleX: 1.06,
            scaleY: 0.96,
            duration: 1.3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          })
          .to(
            smoke,
            {
              skewX: -4,
              y: () => smoke.offsetHeight * -0.015,
              duration: 2.1,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            },
            0,
          );

        // Only runs while the footer is on screen.
        for (const animation of [ride, billow]) {
          ScrollTrigger.create({
            trigger: stage,
            animation,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause resume pause",
          });
        }
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={scene} aria-hidden="true">
      <div className={viaduct} />
      <div ref={trainRef} className={train}>
        <Image
          src="/footer/locomotive.png"
          alt=""
          width={678}
          height={343}
          sizes={trainSizes}
          className={layer}
        />
        <Image
          ref={smokeRef}
          src="/footer/smoke.png"
          alt=""
          width={678}
          height={343}
          sizes={trainSizes}
          className={smokeLayer}
        />
      </div>
    </div>
  );
}
