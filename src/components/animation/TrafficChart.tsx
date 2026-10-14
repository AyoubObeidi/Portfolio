"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  areaPath,
  linePath,
  SERIES,
  xAt,
  type ChartPoint,
} from "@/lib/chart";
import { cn } from "@/lib/utils";
import { ChartCursor } from "./ChartCursor";

interface TrafficChartProps {
  points: ChartPoint[];
  ticks: number[];
}

const HEIGHT = 192; // matches h-48
const MAX_LABELS = 7;

// Line chart for the analytics page. Lines draw in left to right on load and
// whenever the range changes; under reduced motion they just appear.
// Decorative for screen readers: the page renders the same data as a table.
export function TrafficChart({ points, ticks }: TrafficChartProps) {
  const scope = useRef<HTMLDivElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const reveal = useRef<SVGRectElement>(null);
  const id = useId();
  // Until measured, the SVG stretches a 600-wide drawing to fit.
  const [width, setWidth] = useState<number | null>(null);
  const max = ticks[ticks.length - 1];
  const drawWidth = width ?? 600;
  const labelEvery = Math.ceil(points.length / MAX_LABELS);
  const dataKey = points.map((p) => p.title).join("|");

  useEffect(() => {
    const el = plot.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(reveal.current, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power2.inOut",
          delay: 0.2,
        });
      });
    },
    { scope, dependencies: [dataKey], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className="pl-9">
      <div ref={plot} className="relative h-48">
        {ticks.map((tick) => (
          <div
            key={tick}
            aria-hidden="true"
            className="absolute inset-x-0 border-t border-dashed border-border"
            style={{ bottom: `${(tick / max) * 100}%` }}
          >
            <span className="absolute right-full mr-2 -translate-y-1/2 font-mono text-2xs text-fg-subtle tabular-nums">
              {tick.toLocaleString("en-US")}
            </span>
          </div>
        ))}

        <svg
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 ${drawWidth} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <clipPath id={`${id}-clip`}>
              <rect ref={reveal} x={-4} y={-4} width={drawWidth + 8} height={HEIGHT + 8} />
            </clipPath>
            {SERIES.map((s) => (
              <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" x2="0" y1="0" y2="1" className={s.text}>
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.16} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <g clipPath={`url(#${id}-clip)`}>
            {SERIES.map((s) => {
              const values = points.map((p) => p[s.key]);
              return (
                <g key={s.key}>
                  <path d={areaPath(values, max, drawWidth, HEIGHT)} fill={`url(#${id}-${s.key})`} />
                  <path
                    d={linePath(values, max, drawWidth, HEIGHT)}
                    fill="none"
                    strokeWidth={1.75}
                    strokeDasharray="1 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className={s.stroke}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        <ChartCursor points={points} max={max} />
      </div>

      <div aria-hidden="true" className="relative mt-2 h-4">
        {points.map((point, i) =>
          i % labelEvery === 0 ? (
            <span
              key={point.title}
              className={cn(
                "absolute top-0 font-mono text-2xs whitespace-nowrap text-fg-subtle",
                i === 0
                  ? ""
                  : i === points.length - 1
                    ? "-translate-x-full"
                    : "-translate-x-1/2",
              )}
              style={{ left: `${(xAt(i, points.length, 1) * 100).toFixed(2)}%` }}
            >
              {point.label}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
