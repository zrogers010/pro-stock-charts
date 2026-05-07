export type MarketAsset = {
  symbol: string;
  name: string;
  type: "Stock" | "ETF" | "Crypto" | "Commodity" | "Future" | "Index";
  category: string;
  description: string;
};

export type MarketHub = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  assets: MarketAsset[];
};

export const siteUrl = "https://prostockcharts.com";

export const coreAssets: MarketAsset[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "Stock",
    category: "Mega-cap technology",
    description: "Consumer technology leader with iPhone, Mac, services, and wearables revenue.",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    type: "Stock",
    category: "Mega-cap technology",
    description: "Cloud, productivity software, AI infrastructure, and enterprise platform business.",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    type: "Stock",
    category: "Semiconductors",
    description: "AI accelerator, data center, gaming GPU, and accelerated computing leader.",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "Stock",
    category: "Internet platforms",
    description: "Search, ads, YouTube, Android, cloud infrastructure, and AI research business.",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    type: "Stock",
    category: "E-commerce and cloud",
    description: "Retail marketplace, AWS cloud, advertising, logistics, and subscription platform.",
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    type: "Stock",
    category: "Social platforms",
    description: "Facebook, Instagram, WhatsApp, ads, AI, and metaverse technology company.",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "Stock",
    category: "Electric vehicles",
    description: "Electric vehicle, energy storage, charging, software, and autonomy company.",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    type: "Stock",
    category: "Financials",
    description: "Large diversified bank with consumer, investment banking, and asset management units.",
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    type: "ETF",
    category: "US large-cap ETF",
    description: "ETF tracking the S&P 500 index of large US companies.",
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    type: "ETF",
    category: "Nasdaq 100 ETF",
    description: "ETF tracking the Nasdaq 100, with heavy exposure to large technology companies.",
  },
  {
    symbol: "IWM",
    name: "iShares Russell 2000 ETF",
    type: "ETF",
    category: "Small-cap ETF",
    description: "ETF tracking US small-cap stocks through the Russell 2000 index.",
  },
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "ETF",
    category: "Total market ETF",
    description: "Broad ETF exposure to the total US equity market.",
  },
  {
    symbol: "^GSPC",
    name: "S&P 500",
    type: "Index",
    category: "US benchmark index",
    description: "Market-cap weighted index of 500 leading US large-cap companies.",
  },
  {
    symbol: "^IXIC",
    name: "Nasdaq Composite",
    type: "Index",
    category: "US technology index",
    description: "Broad Nasdaq-listed equity index with significant technology exposure.",
  },
  {
    symbol: "^DJI",
    name: "Dow Jones Industrial Average",
    type: "Index",
    category: "Blue-chip index",
    description: "Price-weighted index of 30 large US blue-chip companies.",
  },
  {
    symbol: "BTC-USD",
    name: "Bitcoin",
    type: "Crypto",
    category: "Cryptocurrency",
    description: "Largest cryptocurrency by market capitalization and the primary crypto benchmark.",
  },
  {
    symbol: "ETH-USD",
    name: "Ethereum",
    type: "Crypto",
    category: "Cryptocurrency",
    description: "Smart contract blockchain asset used across decentralized applications.",
  },
  {
    symbol: "SOL-USD",
    name: "Solana",
    type: "Crypto",
    category: "Cryptocurrency",
    description: "High-throughput blockchain asset used for decentralized apps and payments.",
  },
  {
    symbol: "XRP-USD",
    name: "XRP",
    type: "Crypto",
    category: "Cryptocurrency",
    description: "Digital asset associated with fast settlement and cross-border payment use cases.",
  },
  {
    symbol: "GC=F",
    name: "Gold Futures",
    type: "Commodity",
    category: "Precious metals",
    description: "Gold futures benchmark used by traders tracking precious metals.",
  },
  {
    symbol: "SI=F",
    name: "Silver Futures",
    type: "Commodity",
    category: "Precious metals",
    description: "Silver futures benchmark for precious metals and industrial demand.",
  },
  {
    symbol: "CL=F",
    name: "Crude Oil Futures",
    type: "Commodity",
    category: "Energy",
    description: "WTI crude oil futures benchmark for energy markets.",
  },
  {
    symbol: "NG=F",
    name: "Natural Gas Futures",
    type: "Commodity",
    category: "Energy",
    description: "Natural gas futures benchmark for US energy markets.",
  },
];

const byType = (type: MarketAsset["type"]) =>
  coreAssets.filter((asset) => asset.type === type);

export const marketHubs: MarketHub[] = [
  {
    slug: "stocks",
    title: "Popular Stock Charts",
    eyebrow: "Stocks",
    description: "Free professional stock charts for popular US companies, including price, volume, key statistics, and news.",
    intro:
      "Track popular stock charts with clean price action, candlestick views, volume, market cap, day range, and company profile data. These pages are built for quick research without an account or paywall.",
    assets: byType("Stock"),
  },
  {
    slug: "etfs",
    title: "ETF Charts",
    eyebrow: "ETFs",
    description: "Free ETF charts for broad market funds, Nasdaq funds, small-cap ETFs, and total market exposure.",
    intro:
      "Compare ETF price trends, trading ranges, volume, and market context for widely followed funds. ETF charts are useful for market direction, portfolio allocation, and sector rotation research.",
    assets: byType("ETF"),
  },
  {
    slug: "crypto",
    title: "Crypto Price Charts",
    eyebrow: "Crypto",
    description: "Free crypto charts for Bitcoin, Ethereum, Solana, XRP, and other major digital assets.",
    intro:
      "Follow crypto price action with the same fast charting interface used for stocks and futures. Track line and candlestick trends across short-term and long-term timeframes.",
    assets: byType("Crypto"),
  },
  {
    slug: "commodities",
    title: "Commodity and Futures Charts",
    eyebrow: "Commodities",
    description: "Free charts for gold, silver, crude oil, natural gas, and other major commodity futures.",
    intro:
      "Watch commodity and futures markets with clean price charts, exportable historical data, and simple navigation between energy and metals benchmarks.",
    assets: byType("Commodity"),
  },
  {
    slug: "futures",
    title: "Futures Charts",
    eyebrow: "Futures",
    description: "Free futures charts for traders following commodities, energy, metals, and market benchmarks.",
    intro:
      "Use futures charts to track price momentum, volatility, volume, and long-term trend context for major contracts such as gold, crude oil, silver, and natural gas.",
    assets: byType("Commodity"),
  },
  {
    slug: "indices",
    title: "Market Index Charts",
    eyebrow: "Indices",
    description: "Free index charts for the S&P 500, Nasdaq Composite, Dow Jones Industrial Average, and other benchmarks.",
    intro:
      "Index charts help frame the broader market before looking at individual stocks. Track major benchmark levels and quickly jump into related ETFs or component stocks.",
    assets: byType("Index"),
  },
];

export const featuredHubSlugs = [
  "stocks",
  "etfs",
  "crypto",
  "commodities",
  "futures",
  "indices",
];

export const stockPageSymbols = coreAssets.map((asset) => asset.symbol);

export function getAsset(symbol: string) {
  return coreAssets.find(
    (asset) => asset.symbol.toUpperCase() === symbol.toUpperCase()
  );
}

export function getMarketHub(slug: string) {
  return marketHubs.find((hub) => hub.slug === slug);
}

export function getRelatedAssets(symbol: string) {
  const current = getAsset(symbol);
  if (!current) return coreAssets.slice(0, 6);

  return coreAssets
    .filter((asset) => asset.symbol !== current.symbol)
    .filter(
      (asset) => asset.type === current.type || asset.category === current.category
    )
    .concat(coreAssets.filter((asset) => asset.symbol !== current.symbol))
    .filter(
      (asset, index, assets) =>
        assets.findIndex((candidate) => candidate.symbol === asset.symbol) ===
        index
    )
    .slice(0, 6);
}
