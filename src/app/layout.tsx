import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DeprecationNotice } from "@/components/layout/DeprecationNotice";
import { ProgressProvider } from "@/components/progress/ProgressProvider";
import { isDeprecatedBuild, primarySiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "CNC Academy — from beginner to machine designer",
    template: "%s · CNC Academy",
  },
  description:
    "A structured course that takes a complete beginner from what CNC is to designing a custom CNC milling machine. Twenty levels, interactive tools and a full design project.",

  /*
    On the archived GitHub Pages build every page points at its own counterpart
    on the canonical site, so search engines credit the Azure copy rather than
    treating the two as duplicates competing with each other.

    `metadataBase` plus a relative `"./"` is what makes it per-page: Next
    resolves the canonical against the origin and the route being rendered, so
    `/learn/understanding-xyz/` canonicalises to the same path on Azure and not
    to its home page. Both builds use trailing slashes, so the paths line up.

    No `robots: noindex` alongside it — deliberately. A page that is not indexed
    cannot pass its ranking on, so the two directives together would throw away
    exactly what the canonical is here to preserve.
  */
  ...(isDeprecatedBuild
    ? {
        metadataBase: new URL(primarySiteUrl),
        alternates: { canonical: "./" },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#F1F3F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Fonts are loaded with plain link tags rather than next/font/google.
          next/font fetches at build time, which breaks builds in restricted or
          offline CI. Full fallback stacks live in tailwind.config.ts.
          SPEC.md section 3.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- deliberate, see above */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ProgressProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <DeprecationNotice />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </ProgressProvider>
      </body>
    </html>
  );
}
