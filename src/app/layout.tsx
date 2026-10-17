import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ContactDialog } from "@/components/animation/ContactDialog";
import { ClickSound } from "@/components/ui/ClickSound";
import { InlineScript } from "@/components/ui/InlineScript";
import { Footer } from "@/components/sections/Footer";
import { SiteNav } from "@/components/sections/SiteNav";
import { profile } from "@/lib/profile";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Android Chrome otherwise lays the keyboard over the page without resizing it,
// which hid the contact chat's reply box. iOS ignores this; useSheetFit covers it there.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    template: `%s · ${profile.name}`,
    default: siteTitle,
  },
  description: siteDescription,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: "en_US",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: { card: "summary_large_image" },
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
        <div className="flex min-h-dvh flex-col">
          <div className="mx-auto flex w-full max-w-page flex-1 flex-col px-4 pt-7 sm:px-6">
            <SiteNav />
            <main id="main" className="flex-1">
              {children}
            </main>
          </div>
          <Footer />
        </div>
        <ContactDialog />
        <ClickSound />
        <Analytics />
      </body>
    </html>
  );
}
