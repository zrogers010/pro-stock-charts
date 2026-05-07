import MarketHubPage from "@/components/MarketHubPage";
import { getHubMetadata } from "@/lib/market-pages";
import { getMarketHub } from "@/lib/markets";

export const metadata = getHubMetadata("etfs");

export default function EtfsPage() {
  return <MarketHubPage hub={getMarketHub("etfs")!} />;
}
