import CuratedAssetPage from "@/components/CuratedAssetPage";
import {
  assetToSlug,
  curatedAssetJsonLd,
  getCuratedAsset,
  getCuratedAssetMetadata,
} from "@/lib/market-pages";
import { getMarketHub } from "@/lib/markets";
import { notFound } from "next/navigation";

const hubSlug = "commodities";

export async function generateStaticParams() {
  return getMarketHub(hubSlug)!.assets.map((asset) => ({
    assetSlug: assetToSlug(asset),
  }));
}

export function generateMetadata({ params }: { params: { assetSlug: string } }) {
  return getCuratedAssetMetadata(hubSlug, params.assetSlug);
}

export default function CommodityCuratedPage({
  params,
}: {
  params: { assetSlug: string };
}) {
  const match = getCuratedAsset(hubSlug, params.assetSlug);
  if (!match) notFound();
  const jsonLd = curatedAssetJsonLd(hubSlug, params.assetSlug);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CuratedAssetPage asset={match.asset} hub={match.hub} />
    </>
  );
}
