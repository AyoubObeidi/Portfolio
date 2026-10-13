import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/ui/InlineScript";
import { Footer } from "@/components/sections/Footer";
import { SiteNav } from "@/components/sections/SiteNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s · Ayoub Obeidi",
    default: "Ayoub Obeidi · Frontend Developer",
  },
  description:
    "Ayoub Obeidi builds fast, considered interfaces for the web, mostly with React and Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html="document.documentElement.classList.add('js')" />
      </head>
      <body className="min-h-full bg-bg font-sans text-fg">
        <a
          href="#main"
          className="sr-only rounded-md bg-fg px-3 py-2 text-sm text-on-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-10"
        >
          Skip to content
        </a>
        <div className="mx-auto flex min-h-dvh w-full max-w-page flex-col px-4 pt-7 sm:px-6">
          <SiteNav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
