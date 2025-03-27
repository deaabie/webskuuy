
/**
 * Format a number with commas as thousand separators
 */
export const formatNumber = (num: number | string): string => {
  return Number(num).toLocaleString();
};

/**
 * Format a date string to localized date/time format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};
