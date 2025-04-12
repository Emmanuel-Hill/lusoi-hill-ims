
// Currency formatter for Kenyan Shillings (KES)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format number with comma separators (no currency symbol)
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-KE').format(value);
};
