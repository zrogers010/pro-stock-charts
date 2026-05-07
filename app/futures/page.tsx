import MarketHubPage from "@/components/MarketHubPage";
import { getHubMetadata } from "@/lib/market-pages";
import { getMarketHub } from "@/lib/markets";

export const metadata = getHubMetadata("futures");

export default function FuturesPage() {
  return <MarketHubPage hub={getMarketHub("futures")!} />;
}
