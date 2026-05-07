import MarketHubPage from "@/components/MarketHubPage";
import { getHubMetadata } from "@/lib/market-pages";
import { getMarketHub } from "@/lib/markets";

export const metadata = getHubMetadata("crypto");

export default function CryptoPage() {
  return <MarketHubPage hub={getMarketHub("crypto")!} />;
}
