import Image from "next/image";
import { cn } from "@/lib/utils";

interface ScreenshotFrameProps {
  src: string;
  alt: string;
  // Shown in the toolbar; omitted for projects without a live site.
  url?: string;
  sizes: string;
  preload?: boolean;
  // Lifts the window when an ancestor `group` is hovered or holds a focused link.
  lift?: boolean;
}

// A screenshot shown as a browser window resting on a mat, cropped at the bottom edge.
export function ScreenshotFrame({
  src,
  alt,
  url,
  sizes,
  preload,
  lift,
}: ScreenshotFrameProps) {
  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-border bg-surface-raised px-[7%] pt-[7%]">
      <div
        className={cn(
          "overflow-hidden rounded-t-lg border border-b-0 border-border-strong/60 bg-surface shadow-window",
          lift &&
            "transition-[translate] duration-300 ease-(--ease-out) motion-safe:group-hover:-translate-y-1.5 motion-safe:group-has-[a:focus-visible]:-translate-y-1.5",
        )}
      >
        <div className="grid h-7 grid-cols-[1fr_auto_1fr] items-center border-b border-border px-3">
          <div aria-hidden="true" className="flex gap-1.5">
            <span className="size-2 rounded-full bg-border-strong" />
            <span className="size-2 rounded-full bg-border-strong" />
            <span className="size-2 rounded-full bg-border-strong" />
          </div>
          {url && (
            <span className="truncate font-mono text-2xs text-fg-subtle">
              {new URL(url).host}
            </span>
          )}
        </div>
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={800}
          sizes={sizes}
          preload={preload}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
