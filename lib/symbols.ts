const symbolPattern = /^[A-Z0-9.^=-]{1,20}$/;

export function normalizeSymbol(input: string) {
  return input.trim().toUpperCase();
}

export function isValidMarketSymbol(input: string) {
  return symbolPattern.test(normalizeSymbol(input));
}
