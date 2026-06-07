export function getAssetClassLabel(quoteType: string | null | undefined) {
  switch (quoteType) {
    case "ETF":
      return "ETF";
    case "CRYPTOCURRENCY":
      return "Crypto";
    case "FUTURE":
    case "COMMODITY":
      return "Futures";
    case "INDEX":
      return "Index";
    case "EQUITY":
      return "Stock";
    default:
      return "Market";
  }
}
