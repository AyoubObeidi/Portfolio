"use client";

import { use, useEffect, useMemo, useState } from "react";
import { io } from "next/cache";

interface LocalTimeProps {
  timeZone: string;
}

// Render inside <Suspense>: io() keeps the current time out of the prerendered shell.
export function LocalTime({ timeZone }: LocalTimeProps) {
  use(io());
  const [now, setNow] = useState(() => new Date());
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [timeZone],
  );

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time dateTime={now.toISOString()} suppressHydrationWarning>
      {formatter.format(now)}
    </time>
  );
}
