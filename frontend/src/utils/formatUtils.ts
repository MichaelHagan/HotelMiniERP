export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-US', options).format(value);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const roundToDecimals = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const calculateDepreciation = (
  purchasePrice: number,
  currentValue: number,
  purchaseDate: string
): {
  depreciatedValue: number;
  depreciationAmount: number;
  depreciationPercentage: number;
  ageInYears: number;
} => {
  const purchase = new Date(purchaseDate);
  const now = new Date();
  const ageInYears = (now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
  const depreciationAmount = purchasePrice - currentValue;
  const depreciationPercentage = (depreciationAmount / purchasePrice) * 100;

  return {
    depreciatedValue: currentValue,
    depreciationAmount,
    depreciationPercentage: roundToDecimals(depreciationPercentage),
    ageInYears: roundToDecimals(ageInYears, 1),
  };
};