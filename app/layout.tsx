import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { socialLinks } from "@/config/social";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
  preload: false,
});

const ttFirsNeue = localFont({
  src: [
    { path: "./fonts/TT_Firs_Neue_Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/TT_Firs_Neue_DemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/TT_Firs_Neue_Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-heading",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.realName, url: siteConfig.url }],
  creator: siteConfig.realName,
  publisher: siteConfig.realName,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    locale: "en_US",
    images: [
      {
        url: "/og/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${siteConfig.name} — ${siteConfig.realName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@kauxync",
    images: ["/og/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0812" },
  ],
};

const themeInit = `(function(){try{var k=${JSON.stringify(
  siteConfig.themeStorageKey
)};var s=localStorage.getItem(k);var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";var p=localStorage.getItem("kauxync-palette");if(p){e.setAttribute("data-palette",p);}e.classList.add("js");}catch(e){document.documentElement.classList.add("js");}})();`;

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.realName,
      alternateName: siteConfig.name,
      url: siteConfig.url,
      image: `${siteConfig.url}/og/og.png`,
      email: `mailto:${siteConfig.email}`,
      jobTitle: "Full-Stack Developer & Software Builder",
      description: siteConfig.description,
      sameAs: socialLinks.filter((link) => link.external).map((link) => link.url),
      knowsAbout: [
        "Web Development",
        "Mobile Development",
        "Software Architecture",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "Systems Programming",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        "@id": `${siteConfig.url}/#person`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteConfig.url}/#profilepage`,
      url: siteConfig.url,
      name: siteConfig.title,
      isPartOf: {
        "@id": `${siteConfig.url}/#website`,
      },
      mainEntity: {
        "@id": `${siteConfig.url}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${ttFirsNeue.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title={`${siteConfig.name} RSS Feed`} href="/blog/rss.xml" />
      </head>
      <body className="font-sans">
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInit }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <BackToTop />
        <script
          id="site-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
