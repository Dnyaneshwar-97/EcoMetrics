import { beforeEach, describe, expect, it } from 'vitest';
import storageService from '../services/storageService';
import { STORAGE_KEYS } from '../constants/ui';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty array when no calculations are stored', () => {
    expect(storageService.getCalculations()).toEqual([]);
  });

  it('persists and retrieves a calculation record', () => {
    const record = { id: 'test-1', score: 70, monthlyFootprintKg: 100 };
    storageService.saveCalculation(record);

    expect(storageService.getCalculations()).toHaveLength(1);
    expect(storageService.getLatestCalculation()).toEqual(record);
  });

  it('removes a calculation by id', () => {
    storageService.saveCalculation({ id: 'a', score: 50 });
    storageService.saveCalculation({ id: 'b', score: 60 });

    storageService.deleteCalculation('a');

    expect(storageService.getCalculations()).toHaveLength(1);
    expect(storageService.getCalculations()[0].id).toBe('b');
  });

  it('clears all stored keys', () => {
    storageService.set(STORAGE_KEYS.THEME, 'dark');
    storageService.saveCalculation({ id: 'x', score: 40 });

    storageService.clearAll();

    expect(storageService.getCalculations()).toEqual([]);
    expect(storageService.getTheme()).toBe('light');
  });
});
