import type { Metadata } from "next";
import { Inter_Tight, Urbanist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cohort PCCOE",
  description: "Cohort PCCOE is the official social platform for PCCOE students to discover communities, connect with peers, collaborate, and stay updated on campus opportunities.",
  keywords: "cohort pccoe, pccoe social platform, pccoe student community, pccoe clubs, pccoe networking, pccoe cohort",
  authors: [{ name: "Cohort PCCOE" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://www.cohortpccoe.in/",
  },
  icons: {
    icon: [
      { url: "https://www.cohortpccoe.in/cohort-logo.png", type: "image/png" }
    ],
    shortcut: "https://www.cohortpccoe.in/cohort-logo.png",
    apple: "https://www.cohortpccoe.in/cohort-logo.png",
  },
  openGraph: {
    siteName: "Cohort PCCOE",
    title: "Cohort PCCOE",
    description: "The official PCCOE student platform for communities, connections, events, and opportunities.",
    type: "website",
    url: "https://www.cohortpccoe.in/",
    images: [
      {
        url: "https://www.cohortpccoe.in/cohort-logo.png",
        alt: "Cohort PCCOE logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cohort PCCOE",
    description: "Cohort PCCOE helps students connect, collaborate, and discover campus opportunities.",
    images: ["https://www.cohortpccoe.in/cohort-logo.png"],
  },
};

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${urbanist.variable}`}>
      <head>
        <Script
          id="ld-json-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Cohort PCCOE",
              "alternateName": "Cohort",
              "url": "https://www.cohortpccoe.in/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.cohortpccoe.in/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Script
          id="ld-json-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Cohort PCCOE",
              "url": "https://www.cohortpccoe.in/",
              "logo": "https://www.cohortpccoe.in/cohort-logo.png",
              "sameAs": [
                "https://github.com/chiragferwani",
                "https://www.linkedin.com/in/chiragferwani/"
              ]
            })
          }}
        />
        <link rel="stylesheet" type="text/css" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css" />
        <Script id="tomtom-maps" src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js" strategy="beforeInteractive"></Script>
      </head>
      <body suppressHydrationWarning={true}>
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none;
            }
            input,
            textarea,
            [contenteditable="true"] {
              -webkit-user-select: text;
              -moz-user-select: text;
              user-select: text;
            }
          `
        }} />
        <Navigation />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
