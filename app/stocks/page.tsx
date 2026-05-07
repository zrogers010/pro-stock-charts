import MarketHubPage from "@/components/MarketHubPage";
import { getHubMetadata } from "@/lib/market-pages";
import { getMarketHub } from "@/lib/markets";

export const metadata = getHubMetadata("stocks");

export default function StocksPage() {
  return <MarketHubPage hub={getMarketHub("stocks")!} />;
}
