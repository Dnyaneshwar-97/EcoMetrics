import { describe, expect, it } from 'vitest';
import {
  generateRecommendations,
  calculateTotalSavings,
} from '../services/recommendationService';

const createCalculationResult = (overrides = {}) => ({
  categories: {
    electricity: 50,
    transportation: 100,
    flights: 20,
    food: 30,
    waste: 10,
  },
  inputs: {
    electricityKwh: 100,
    monthlyDistanceKm: 200,
    domesticFlights: 1,
    internationalFlights: 0,
    foodType: 'mixed',
    weeklyWasteKg: 3,
  },
  ...overrides,
});

describe('recommendationService', () => {
  describe('generateRecommendations', () => {
    it('returns empty array when calculation result is null', () => {
      expect(generateRecommendations(null)).toEqual([]);
    });

    it('returns general maintain recommendation for low footprint inputs', () => {
      const recommendations = generateRecommendations(createCalculationResult());
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].id).toBe('general-maintain');
      expect(recommendations[0].titleKey).toBe('recommendations.fallbackTitle');
    });

    it('returns electricity recommendations when usage exceeds threshold', () => {
      const result = createCalculationResult({
        inputs: {
          electricityKwh: 250,
          monthlyDistanceKm: 100,
          domesticFlights: 0,
          internationalFlights: 0,
          foodType: 'vegan',
          weeklyWasteKg: 2,
        },
      });

      const recommendations = generateRecommendations(result);
      expect(recommendations.some((rec) => rec.category === 'electricity')).toBe(true);
      expect(recommendations.some((rec) => rec.title === 'Switch to LED Bulbs')).toBe(true);
    });

    it('returns transportation recommendations when distance exceeds threshold', () => {
      const result = createCalculationResult({
        inputs: {
          electricityKwh: 100,
          monthlyDistanceKm: 600,
          domesticFlights: 0,
          internationalFlights: 0,
          foodType: 'vegan',
          weeklyWasteKg: 2,
        },
      });

      const recommendations = generateRecommendations(result);
      expect(recommendations.some((rec) => rec.category === 'transportation')).toBe(true);
    });

    it('returns flights recommendations when combined flights meet threshold', () => {
      const result = createCalculationResult({
        inputs: {
          electricityKwh: 50,
          monthlyDistanceKm: 50,
          domesticFlights: 2,
          internationalFlights: 2,
          foodType: 'vegan',
          weeklyWasteKg: 2,
        },
      });

      const recommendations = generateRecommendations(result);
      expect(recommendations.some((rec) => rec.category === 'flights')).toBe(true);
    });

    it('returns food recommendations for high meat diet', () => {
      const result = createCalculationResult({
        inputs: {
          electricityKwh: 50,
          monthlyDistanceKm: 50,
          domesticFlights: 0,
          internationalFlights: 0,
          foodType: 'high_meat',
          weeklyWasteKg: 2,
        },
      });

      const recommendations = generateRecommendations(result);
      expect(recommendations.some((rec) => rec.category === 'food')).toBe(true);
    });

    it('returns waste recommendations when weekly waste exceeds threshold', () => {
      const result = createCalculationResult({
        inputs: {
          electricityKwh: 50,
          monthlyDistanceKm: 50,
          domesticFlights: 0,
          internationalFlights: 0,
          foodType: 'vegan',
          weeklyWasteKg: 12,
        },
      });

      const recommendations = generateRecommendations(result);
      expect(recommendations.some((rec) => rec.category === 'waste')).toBe(true);
    });

    it('can return multiple category recommendations at once', () => {
      const result = createCalculationResult({
        inputs: {
          electricityKwh: 300,
          monthlyDistanceKm: 700,
          domesticFlights: 3,
          internationalFlights: 2,
          foodType: 'high_meat',
          weeklyWasteKg: 15,
        },
      });

      const recommendations = generateRecommendations(result);
      const categories = new Set(recommendations.map((rec) => rec.category));
      expect(categories.has('electricity')).toBe(true);
      expect(categories.has('transportation')).toBe(true);
      expect(categories.has('flights')).toBe(true);
      expect(categories.has('food')).toBe(true);
      expect(categories.has('waste')).toBe(true);
    });
  });

  describe('calculateTotalSavings', () => {
    it('sums co2, money, and tree savings from recommendations', () => {
      const recommendations = [
        { co2ReductionKg: 10, moneySaved: 100, treesEquivalent: 1 },
        { co2ReductionKg: 20, moneySaved: 200, treesEquivalent: 2 },
      ];

      expect(calculateTotalSavings(recommendations)).toEqual({
        co2ReductionKg: 30,
        moneySaved: 300,
        treesEquivalent: 3,
      });
    });

    it('returns zero totals for empty recommendations', () => {
      expect(calculateTotalSavings([])).toEqual({
        co2ReductionKg: 0,
        moneySaved: 0,
        treesEquivalent: 0,
      });
    });
  });
});
