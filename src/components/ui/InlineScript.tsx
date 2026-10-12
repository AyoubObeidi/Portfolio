interface InlineScriptProps {
  html: string;
}

// Runs during HTML parsing on hard loads; see Next's "preventing flash before hydration" guide.
export function InlineScript({ html }: InlineScriptProps) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
