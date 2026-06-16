/**
 * Format number with locale
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '0';
  return Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format currency in INR
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return `₹${formatNumber(amount)}`;
};

/**
 * Format CO2 with unit
 */
export const formatCo2 = (kg, unit = 'kg') => {
  if (unit === 'tonnes') {
    return `${formatNumber(kg / 1000, 2)} tonnes CO₂`;
  }
  return `${formatNumber(kg, 1)} kg CO₂`;
};

/**
 * Get month label from date string
 */
export const getMonthLabel = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
};

/**
 * Filter calculations by time period using entry timestamps
 */
export const filterByPeriod = (calculations, period, referenceDate = new Date()) => {
  if (!calculations?.length) return [];

  const ref = referenceDate.getTime();
  const msPerDay = 24 * 60 * 60 * 1000;

  const isSameCalendarDay = (dateA, dateB) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();

  const isSameCalendarMonth = (dateA, dateB) =>
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth();

  const isSameCalendarYear = (dateA, dateB) =>
    dateA.getFullYear() === dateB.getFullYear();

  const rollingWindowDays = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    yearly: 365,
  };

  return calculations.filter((calc) => {
    const calcDate = new Date(calc.date);
    const calcTime = calcDate.getTime();

    switch (period) {
      case 'daily':
        return isSameCalendarDay(calcDate, referenceDate);
      case 'weekly':
        return ref - calcTime <= 7 * msPerDay;
      case 'monthly':
        return isSameCalendarMonth(calcDate, referenceDate);
      case 'yearly':
        return isSameCalendarYear(calcDate, referenceDate);
      default:
        return ref - calcTime <= (rollingWindowDays[period] ?? 365) * msPerDay;
    }
  });
};
