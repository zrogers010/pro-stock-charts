import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/Footer";
import { siteUrl } from "@/lib/markets";
import { canonicalPath, defaultOgImage } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ProStockCharts - Free Professional Stock Charts",
    template: "%s | ProStockCharts",
  },
  description:
    "Free professional stock charts for stocks, ETFs, crypto, commodities, futures, and indices. Fast interactive charts, market data, news, and CSV exports with no signup.",
  applicationName: "ProStockCharts",
  keywords: [
    "free stock charts",
    "professional stock charts",
    "stock chart",
    "candlestick charts",
    "crypto charts",
    "ETF charts",
    "market data",
  ],
  alternates: {
    canonical: canonicalPath("/"),
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
  openGraph: {
    type: "website",
    url: canonicalPath("/"),
    siteName: "ProStockCharts",
    title: "ProStockCharts - Free Professional Stock Charts",
    description:
      "Fast, free, professional charts and market data for stocks, ETFs, crypto, commodities, futures, and indices.",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "ProStockCharts market charting preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProStockCharts - Free Professional Stock Charts",
    description:
      "Fast, free, professional charts and market data for stocks, ETFs, crypto, commodities, futures, and indices.",
    images: [defaultOgImage],
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
