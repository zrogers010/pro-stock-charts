export type EducationArticle = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export const educationArticles: EducationArticle[] = [
  {
    slug: "how-to-read-candlestick-charts",
    title: "How to Read Candlestick Charts",
    description:
      "Learn how candlestick charts show open, high, low, close, trend, and volatility for stocks, ETFs, crypto, and futures.",
    readTime: "5 min read",
    sections: [
      {
        heading: "What a candle shows",
        body:
          "Each candlestick summarizes price action for a specific time period. The body shows the distance between the open and close, while the wick shows the session high and low. Green candles usually mean the close was above the open, and red candles usually mean the close was below the open.",
      },
      {
        heading: "Why traders use them",
        body:
          "Candles make momentum and volatility easier to scan than a simple line chart. A long body can point to strong buying or selling pressure, while long wicks can show rejection near a price level.",
      },
      {
        heading: "How to use them on ProStockCharts",
        body:
          "Open any ticker page, switch the chart from Line to Candle, and compare multiple ranges such as 1D, 1M, 1Y, and 5Y. The same chart tools work across stocks, ETFs, crypto, commodities, and futures.",
      },
    ],
  },
  {
    slug: "best-free-stock-charts",
    title: "Best Free Stock Charts: What to Look For",
    description:
      "A practical checklist for choosing free stock chart software without giving up speed, clean design, or useful market data.",
    readTime: "4 min read",
    sections: [
      {
        heading: "Speed matters",
        body:
          "A good chart should load quickly, respond smoothly, and make it easy to move between tickers. Slow tools make research harder, especially when you are scanning many stocks in a session.",
      },
      {
        heading: "Use multiple timeframes",
        body:
          "Short-term ranges help with current momentum, while one-year and five-year ranges show larger trend context. Free charting tools should make both views easy to reach.",
      },
      {
        heading: "Avoid unnecessary friction",
        body:
          "For quick research, the best free charting experience does not require a signup before showing basic price, volume, key statistics, and chart history.",
      },
    ],
  },
  {
    slug: "stock-chart-timeframes-explained",
    title: "Stock Chart Timeframes Explained",
    description:
      "Understand when to use 1D, 5D, 1M, 6M, 1Y, and 5Y stock chart ranges for market research.",
    readTime: "4 min read",
    sections: [
      {
        heading: "Short-term ranges",
        body:
          "The 1D and 5D views are useful for intraday moves, earnings reactions, news-driven price changes, and short-term volatility. They are not enough to judge the long-term trend by themselves.",
      },
      {
        heading: "Medium-term ranges",
        body:
          "One-month, three-month, and six-month charts help show whether a stock is consolidating, breaking out, or moving with the broader market.",
      },
      {
        heading: "Long-term ranges",
        body:
          "One-year and five-year charts give context for major support areas, drawdowns, long-term growth, and whether current prices are near historical highs or lows.",
      },
    ],
  },
  {
    slug: "volume-on-stock-charts",
    title: "Volume on Stock Charts",
    description:
      "Learn how trading volume helps confirm price moves and identify unusual activity on stock charts.",
    readTime: "3 min read",
    sections: [
      {
        heading: "Volume confirms participation",
        body:
          "Volume shows how many shares or contracts traded during a period. A price move with high volume often carries more information than a similar move on light activity.",
      },
      {
        heading: "Watch for unusual activity",
        body:
          "Large spikes in volume can happen around earnings, product announcements, macro news, analyst changes, or market-wide volatility. They are worth comparing against average volume.",
      },
      {
        heading: "Use volume with price",
        body:
          "Volume is most useful when paired with price structure. Breakouts, reversals, and sharp selloffs are easier to evaluate when you can see whether participation expanded or faded.",
      },
    ],
  },
  {
    slug: "market-cap-vs-volume",
    title: "Market Cap vs Volume",
    description:
      "Compare market capitalization and trading volume, two key statistics shown on stock quote pages.",
    readTime: "3 min read",
    sections: [
      {
        heading: "Market cap measures size",
        body:
          "Market capitalization is the value of a company based on its share price multiplied by shares outstanding. It is commonly used to compare company size across sectors.",
      },
      {
        heading: "Volume measures activity",
        body:
          "Volume shows how much of an asset traded over a period. It helps traders understand liquidity and how much attention a stock or asset is receiving.",
      },
      {
        heading: "Why both matter",
        body:
          "A large market cap can indicate scale, while high volume can indicate active interest. Looking at both helps separate large established companies from smaller, more volatile names.",
      },
    ],
  },
];

export function getEducationArticle(slug: string) {
  return educationArticles.find((article) => article.slug === slug);
}
