import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProgressProvider } from "@/components/progress/ProgressProvider";

export const metadata: Metadata = {
  title: {
    default: "CNC Academy — from beginner to machine designer",
    template: "%s · CNC Academy",
  },
  description:
    "A structured course that takes a complete beginner from what CNC is to designing a custom CNC milling machine. Twenty levels, interactive tools and a full design project.",
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
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </ProgressProvider>
      </body>
    </html>
  );
}
