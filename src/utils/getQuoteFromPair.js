/**
 * Get quote currency symbol from various pair structures or strings.
 * Works with objects like { quoteToken: { symbol } },
 * plain pair strings like "BTC/USDT" or "ETHUSDC",
 * and accepts explicit base/quote fallback props.
 */
export function getQuoteFromPair(input) {
  const fallback = (typeof input === 'object' && input && 'fallback' in input)
    ? String(input.fallback || 'QUOTE').toUpperCase()
    : 'QUOTE';

  // If already provided directly
  if (typeof input === 'string') {
    return deriveFromString(input, fallback);
  }

  if (!input || typeof input !== 'object') {
    return fallback;
  }

  // Prefer explicit quoteSymbol passed in
  if (input.quoteSymbol) {
    return String(input.quoteSymbol).toUpperCase();
  }

  // Pair object with nested tokens
  const pair = input.pair || input;
  // Support both object and string forms
  const explicitQuote = pair?.quoteToken?.symbol || pair?.quote?.symbol || (typeof pair?.quoteToken === 'string' ? pair.quoteToken : undefined);
  if (explicitQuote) {
    return String(explicitQuote).toUpperCase();
  }

  // Try known fields that might contain a pair string
  const pairLike = pair?.symbol || pair?.pair || pair?.pairSymbol || pair?.pairLabel || pair?.name;
  if (pairLike) {
    return deriveFromString(String(pairLike), fallback);
  }

  // Last attempt: combine base/quote if available
  if (pair?.baseToken?.symbol && pair?.quoteToken?.symbol) {
    return String(pair.quoteToken.symbol).toUpperCase();
  }

  return fallback;
}

function deriveFromString(raw, fallback) {
  if (!raw) return fallback;
  const s = String(raw).trim().toUpperCase();

  // Delimiter-based formats first (e.g., BTC/USDT, ETH-USDC, SOL_USD)
  const delimiters = ['/', '-', '_', ':'];
  for (const d of delimiters) {
    if (s.includes(d)) {
      const parts = s.split(d).filter(Boolean);
      return parts.length ? parts[parts.length - 1] : fallback;
    }
  }

  // Suffix-based formats (e.g., BTCUSDT, ETHUSDC)
  const COMMON_QUOTES = [
    'USDT', 'USDC', 'BUSD', 'FDUSD', 'TUSD', 'DAI', 'UST',
    'BTC', 'ETH', 'BNB',
    'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'BRL', 'TRY', 'IDR', 'NGN', 'MXN', 'ZAR', 'INR', 'RUB', 'USD'
  ];
  const hit = COMMON_QUOTES.find(q => s.endsWith(q));
  return hit || fallback;
}

export default getQuoteFromPair;


