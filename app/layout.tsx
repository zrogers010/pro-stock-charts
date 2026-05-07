import type { Metadata } from "next";
import Script from "next/script";
import { siteUrl } from "@/lib/markets";
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
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ProStockCharts",
    title: "ProStockCharts - Free Professional Stock Charts",
    description:
      "Fast, free, professional charts and market data for stocks, ETFs, crypto, commodities, futures, and indices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProStockCharts - Free Professional Stock Charts",
    description:
      "Fast, free, professional charts and market data for stocks, ETFs, crypto, commodities, futures, and indices.",
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
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VZX4R5JT2S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VZX4R5JT2S');
          `}
        </Script>
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
