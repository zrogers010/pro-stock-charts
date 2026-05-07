import type { Metadata } from "next";
import type { MarketAsset } from "@/lib/markets";
import { getMarketHub, siteUrl } from "@/lib/markets";

export function assetToSlug(asset: MarketAsset) {
  const normalized = asset.symbol
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${normalized}-chart`;
}

export function getCuratedAsset(hubSlug: string, assetSlug: string) {
  const hub = getMarketHub(hubSlug);
  if (!hub) return null;

  const asset = hub.assets.find((candidate) => assetToSlug(candidate) === assetSlug);
  if (!asset) return null;

  return { hub, asset };
}

export function getHubMetadata(hubSlug: string): Metadata {
  const hub = getMarketHub(hubSlug);
  if (!hub) return {};

  return {
    title: hub.title,
    description: hub.description,
    alternates: {
      canonical: `/${hub.slug}`,
    },
    openGraph: {
      title: hub.title,
      description: hub.description,
      url: `/${hub.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: hub.title,
      description: hub.description,
    },
  };
}

export function getCuratedAssetMetadata(
  hubSlug: string,
  assetSlug: string
): Metadata {
  const match = getCuratedAsset(hubSlug, assetSlug);
  if (!match) return {};
  const { asset, hub } = match;
  const title = `${asset.name} (${asset.symbol}) Chart`;
  const description = `Free ${asset.name} chart with candlestick views, price history, market data, news, and CSV export on ProStockCharts.`;
  const path = `/${hub.slug}/${assetSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function curatedAssetJsonLd(hubSlug: string, assetSlug: string) {
  const match = getCuratedAsset(hubSlug, assetSlug);
  if (!match) return null;
  const { asset, hub } = match;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${asset.name} (${asset.symbol}) Chart`,
    url: `${siteUrl}/${hub.slug}/${assetSlug}`,
    description: `Free professional chart and market data for ${asset.name}.`,
    about: {
      "@type": "Thing",
      name: asset.name,
      identifier: asset.symbol,
    },
  };
}
