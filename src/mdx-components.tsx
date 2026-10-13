import type { MDXComponents } from "mdx/types";
import { externalLinkProps } from "@/lib/utils";

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-10 mb-3 text-base font-semibold text-fg" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 text-sm font-semibold text-fg" {...props} />
  ),
  p: (props) => (
    <p className="mb-4 text-sm leading-6 text-fg-muted" {...props} />
  ),
  ul: (props) => (
    <ul
      className="mb-4 list-disc space-y-1 pl-5 text-sm leading-6 text-fg-muted"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-4 list-decimal space-y-1 pl-5 text-sm leading-6 text-fg-muted"
      {...props}
    />
  ),
  a: ({ href = "", ...props }) => (
    <a
      href={href}
      {...externalLinkProps(href)}
      className="font-medium text-fg underline underline-offset-4"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  code: (props) => (
    <code
      className="rounded-sm bg-surface-raised px-1 py-0.5 font-mono text-xs text-fg"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mb-4 border-l-2 border-border-strong pl-4"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
