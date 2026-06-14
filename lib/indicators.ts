export type IndicatorArticle = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  readTime: string;
  formula: string;
  bestFor: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
  pitfalls: string[];
};

export const indicatorArticles: IndicatorArticle[] = [
  {
    slug: "rsi",
    title: "Relative Strength Index (RSI) Explained",
    shortTitle: "RSI",
    description:
      "Learn what the Relative Strength Index measures, how traders read overbought and oversold levels, and where RSI signals can fail.",
    readTime: "5 min read",
    formula: "RSI = 100 - (100 / (1 + average gain / average loss))",
    bestFor: [
      "Spotting stretched short-term moves",
      "Comparing momentum across recent swings",
      "Finding divergence to research further",
    ],
    sections: [
      {
        heading: "What RSI measures",
        body:
          "The Relative Strength Index is a momentum oscillator that compares recent average gains with recent average losses. It is usually plotted from 0 to 100 below a price chart, with many traders watching the 30 and 70 zones as rough reference levels.",
      },
      {
        heading: "How traders read it",
        body:
          "A high RSI can show strong upside momentum or a stretched rally. A low RSI can show strong downside momentum or a stretched selloff. The useful question is not whether RSI crosses one level, but whether the signal fits the trend, volume, and broader market context.",
      },
      {
        heading: "Why divergence matters",
        body:
          "Divergence happens when price makes a new high or low while RSI does not confirm it. This can flag fading momentum, but it is only a research clue. Trends can continue for a long time after divergence appears.",
      },
    ],
    pitfalls: [
      "Treating overbought as an automatic sell signal",
      "Ignoring the larger trend",
      "Using RSI without checking price structure or volume",
    ],
  },
  {
    slug: "macd",
    title: "MACD Indicator Explained",
    shortTitle: "MACD",
    description:
      "Understand how MACD uses moving averages to show trend momentum, signal-line crosses, and histogram changes.",
    readTime: "5 min read",
    formula: "MACD line = 12-period EMA - 26-period EMA",
    bestFor: [
      "Tracking trend momentum",
      "Watching signal-line crosses",
      "Seeing momentum expand or fade with the histogram",
    ],
    sections: [
      {
        heading: "What MACD measures",
        body:
          "MACD compares two exponential moving averages to estimate trend momentum. The default MACD line subtracts the 26-period EMA from the 12-period EMA, then adds a 9-period signal line and a histogram showing the gap between them.",
      },
      {
        heading: "How traders read it",
        body:
          "A MACD line above the signal line can point to improving momentum, while a move below the signal line can point to weakening momentum. Crosses near the zero line often carry different context than crosses after a large extended move.",
      },
      {
        heading: "Why the histogram helps",
        body:
          "The histogram makes momentum changes easier to scan. Expanding bars show the MACD line pulling away from the signal line, while shrinking bars show the gap narrowing.",
      },
    ],
    pitfalls: [
      "Reacting to every cross in a choppy market",
      "Forgetting MACD is based on lagging averages",
      "Using default settings without considering timeframe",
    ],
  },
  {
    slug: "bollinger-bands",
    title: "Bollinger Bands Explained",
    shortTitle: "Bollinger Bands",
    description:
      "Learn how Bollinger Bands use a moving average and standard deviation to frame volatility, trend pressure, and range expansion.",
    readTime: "5 min read",
    formula:
      "Middle band = moving average; upper/lower bands = moving average +/- standard deviations",
    bestFor: [
      "Scanning volatility expansion and contraction",
      "Comparing price against a moving average envelope",
      "Researching breakouts from tight ranges",
    ],
    sections: [
      {
        heading: "What Bollinger Bands show",
        body:
          "Bollinger Bands place an upper and lower volatility band around a moving average. The bands widen when volatility increases and narrow when volatility decreases, making them useful for seeing when a market is quiet or active.",
      },
      {
        heading: "How traders read them",
        body:
          "Price near the upper band can show strength, while price near the lower band can show weakness. A close outside a band is not automatically a reversal signal; in strong trends, price can ride a band for several periods.",
      },
      {
        heading: "Why squeezes get attention",
        body:
          "A squeeze happens when the bands become unusually tight. It can signal that volatility has compressed, which often leads traders to watch for a later breakout or breakdown.",
      },
    ],
    pitfalls: [
      "Assuming every band touch means price must reverse",
      "Ignoring whether volatility is expanding or contracting",
      "Using bands without support, resistance, or volume context",
    ],
  },
];

export function getIndicatorArticle(slug: string) {
  return indicatorArticles.find((article) => article.slug === slug);
}
