import dayjs from 'dayjs';

export function formatCurrency(num, currency = 'USD') {
  return num?.toLocaleString('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }) ?? '-';
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
}

export function formatPercent(num) {
  if (num === null || num === undefined) return '-';
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
}

export function formatDate(date, format = 'YYYY-MM-DD HH:mm') {
  return dayjs(date).format(format);
} 