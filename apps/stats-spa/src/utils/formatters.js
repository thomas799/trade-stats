export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return null;
  return Number(num).toFixed(decimals);
}

export function formatDate(dateString, locale = 'ru-RU') {
  const date = new Date(dateString);
  return date.toLocaleString(locale);
}
