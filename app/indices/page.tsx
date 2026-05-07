import MarketHubPage from "@/components/MarketHubPage";
import { getHubMetadata } from "@/lib/market-pages";
import { getMarketHub } from "@/lib/markets";

export const metadata = getHubMetadata("indices");

export default function IndicesPage() {
  return <MarketHubPage hub={getMarketHub("indices")!} />;
}
