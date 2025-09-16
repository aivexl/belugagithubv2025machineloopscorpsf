/**
 * Utility functions for consistent number formatting across all crypto components
 * Ensures proper semicolon formatting and consistent display
 */

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 * Uses toLocaleString for proper semicolon formatting
 */
export function formatLargeNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

/**
 * Format crypto prices with proper decimal places
 * Uses toLocaleString for prices >= 1 to ensure semicolon formatting
 */
export function formatCryptoPrice(price) {
  if (price >= 1) {
    return '$' + price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }
  if (price >= 0.01) {
    return '$' + price.toFixed(4);
  }
  return '$' + price.toFixed(6);
}

/**
 * Format percentage changes with proper sign
 */
export function formatPercentageChange(percentage) {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

/**
 * Format volume with proper semicolon formatting
 */
export function formatVolume(volume) {
  return '$' + (volume || 0).toLocaleString();
}

/**
 * Format market cap with proper semicolon formatting
 */
export function formatMarketCap(marketCap) {
  return formatLargeNumber(marketCap);
}

