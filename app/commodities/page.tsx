import MarketHubPage from "@/components/MarketHubPage";
import { getHubMetadata } from "@/lib/market-pages";
import { getMarketHub } from "@/lib/markets";

export const metadata = getHubMetadata("commodities");

export default function CommoditiesPage() {
  return <MarketHubPage hub={getMarketHub("commodities")!} />;
}
