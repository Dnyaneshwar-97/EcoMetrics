import { describe, expect, it } from 'vitest';
import {
  formatNumber,
  formatDate,
  formatDateTime,
  formatCurrency,
  formatCo2,
  getMonthLabel,
  filterByPeriod,
} from '../utils/formatters';
import { TIME_PERIODS } from '../constants/ui';

describe('formatNumber', () => {
  it('formats valid numbers with locale', () => {
    expect(formatNumber(1234.5, 1)).toBe('1,234.5');
  });

  it('returns 0 for invalid values', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
    expect(formatNumber(Number.NaN)).toBe('0');
  });
});

describe('formatDate', () => {
  it('formats ISO date strings', () => {
    expect(formatDate('2026-01-15T10:00:00.000Z')).toMatch(/15 Jan 2026/);
  });

  it('returns empty string for missing input', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
  });
});

describe('formatDateTime', () => {
  it('includes time in formatted output', () => {
    const formatted = formatDateTime('2026-01-15T10:30:00.000Z');
    expect(formatted).toMatch(/15 Jan 2026/);
    expect(formatted).toMatch(/\d{1,2}:\d{2}/);
  });
});

describe('formatCurrency', () => {
  it('prefixes INR symbol', () => {
    expect(formatCurrency(500)).toBe('₹500');
  });

  it('returns ₹0 for nullish values', () => {
    expect(formatCurrency(null)).toBe('₹0');
  });
});

describe('formatCo2', () => {
  it('formats kg by default', () => {
    expect(formatCo2(12.34)).toBe('12.3 kg CO₂');
  });

  it('formats tonnes when requested', () => {
    expect(formatCo2(1500, 'tonnes')).toBe('1.50 tonnes CO₂');
  });
});

describe('getMonthLabel', () => {
  it('returns short month and year', () => {
    expect(getMonthLabel('2026-03-01T00:00:00.000Z')).toMatch(/Mar 26/);
  });
});

describe('filterByPeriod', () => {
  const referenceDate = new Date('2026-06-15T12:00:00.000Z');
  const calculations = [
    { id: '1', date: '2026-06-15T08:00:00.000Z' },
    { id: '2', date: '2026-06-10T08:00:00.000Z' },
    { id: '3', date: '2026-05-20T08:00:00.000Z' },
    { id: '4', date: '2025-12-01T08:00:00.000Z' },
  ];

  it('returns empty array for missing input', () => {
    expect(filterByPeriod(null, TIME_PERIODS.DAILY)).toEqual([]);
    expect(filterByPeriod([], TIME_PERIODS.DAILY)).toEqual([]);
  });

  it('filters by daily calendar day', () => {
    const result = filterByPeriod(calculations, TIME_PERIODS.DAILY, referenceDate);
    expect(result.map((calc) => calc.id)).toEqual(['1']);
  });

  it('filters by weekly rolling window', () => {
    const result = filterByPeriod(calculations, TIME_PERIODS.WEEKLY, referenceDate);
    expect(result.map((calc) => calc.id)).toEqual(['1', '2']);
  });

  it('filters by monthly calendar month', () => {
    const result = filterByPeriod(calculations, TIME_PERIODS.MONTHLY, referenceDate);
    expect(result.map((calc) => calc.id)).toEqual(['1', '2']);
  });

  it('filters by yearly calendar year', () => {
    const result = filterByPeriod(calculations, TIME_PERIODS.YEARLY, referenceDate);
    expect(result.map((calc) => calc.id)).toEqual(['1', '2', '3']);
  });
});
