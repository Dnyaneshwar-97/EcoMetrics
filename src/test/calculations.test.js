import { describe, expect, it } from 'vitest';
import {
  clamp,
  calculateScore,
  getScoreCategory,
  calculateEnvironmentalImpact,
  calculateImprovement,
  getFootprintForPeriod,
  scaleReductionPercent,
  shouldUseTonnesUnit,
} from '../utils/calculations';
import { SCORE_CATEGORIES } from '../constants/emissionFactors';
import { TIME_PERIODS } from '../constants/ui';

describe('clamp', () => {
  it('clamps a value within the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps a value below the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps a value above the maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('returns the value if min and max are equal and value is within bounds', () => {
    expect(clamp(5, 5, 5)).toBe(5);
  });
});

describe('calculateScore', () => {
  it('returns 100 for 0 annual footprint', () => {
    expect(calculateScore(0)).toBe(100);
  });

  it('returns 0 for very high annual footprint', () => {
    expect(calculateScore(10)).toBe(0);
  });

  it('calculates score based on average Indian footprint (1.9 tonnes)', () => {
    // Formula: 100 - (annualFootprintTonnes / 1.9) * 50
    expect(calculateScore(0.95)).toBe(75); // (0.95 / 1.9) * 50 = 0.5 * 50 = 25; 100 - 25 = 75
    expect(calculateScore(1.9)).toBe(50); // (1.9 / 1.9) * 50 = 1 * 50 = 50; 100 - 50 = 50
    expect(calculateScore(2.85)).toBe(25); // (2.85 / 1.9) * 50 = 1.5 * 50 = 75; 100 - 75 = 25
  });

  it('clamps score between 0 and 100', () => {
    expect(calculateScore(-1)).toBe(100); // Should be clamped to 100
    expect(calculateScore(5)).toBe(0); // Should be clamped to 0
  });
});

describe('getScoreCategory', () => {
  it('returns Excellent for score >= 80', () => {
    expect(getScoreCategory(80)).toBe(SCORE_CATEGORIES.EXCELLENT);
    expect(getScoreCategory(95)).toBe(SCORE_CATEGORIES.EXCELLENT);
  });

  it('returns Good for score >= 60', () => {
    expect(getScoreCategory(60)).toBe(SCORE_CATEGORIES.GOOD);
    expect(getScoreCategory(79)).toBe(SCORE_CATEGORIES.GOOD);
  });

  it('returns Moderate for score >= 40', () => {
    expect(getScoreCategory(40)).toBe(SCORE_CATEGORIES.MODERATE);
    expect(getScoreCategory(59)).toBe(SCORE_CATEGORIES.MODERATE);
  });

  it('returns High for score >= 20', () => {
    expect(getScoreCategory(20)).toBe(SCORE_CATEGORIES.HIGH);
    expect(getScoreCategory(39)).toBe(SCORE_CATEGORIES.HIGH);
  });

  it('returns Critical for score < 20', () => {
    expect(getScoreCategory(19)).toBe(SCORE_CATEGORIES.CRITICAL);
    expect(getScoreCategory(0)).toBe(SCORE_CATEGORIES.CRITICAL);
  });
});

describe('calculateEnvironmentalImpact', () => {
  it('calculates correct impact for 2100 kg CO2 (100 trees)', () => {
    const impact = calculateEnvironmentalImpact(2100);
    expect(impact.treesRequired).toBe(100); // 2100 / 21 = 100
    expect(impact.kmDriven).toBe(10000); // 2100 / 0.21 = 10000
    expect(impact.coalBurned).toBe(875); // (2100 / 2.4) rounded to 1 decimal
    expect(impact.smartphoneCharges).toBe(262500); // 2100 / 0.008 = 262500
    expect(impact.electricityKwh).toBe(1721); // 2100 / 1.22 = 1721.3... rounded
  });

  it('handles 0 kg CO2 gracefully', () => {
    const impact = calculateEnvironmentalImpact(0);
    expect(impact.treesRequired).toBe(0);
    expect(impact.kmDriven).toBe(0);
    expect(impact.coalBurned).toBe(0);
    expect(impact.smartphoneCharges).toBe(0);
    expect(impact.electricityKwh).toBe(0);
  });
});

describe('calculateImprovement', () => {
  it('returns 0 when previous footprint is 0 or missing', () => {
    expect(calculateImprovement(100, 0)).toBe(0);
    expect(calculateImprovement(100, null)).toBe(0);
  });

  it('calculates positive improvement when footprint decreases', () => {
    expect(calculateImprovement(900, 1000)).toBe(10);
  });

  it('calculates negative improvement when footprint increases', () => {
    expect(calculateImprovement(1100, 1000)).toBe(-10);
  });

  it('rounds to one decimal place', () => {
    expect(calculateImprovement(333, 1000)).toBe(66.7);
  });
});

describe('getFootprintForPeriod', () => {
  const calculation = {
    annualFootprintKg: 3650,
    monthlyFootprintKg: 304.17,
  };

  it('returns 0 for null calculation', () => {
    expect(getFootprintForPeriod(null, TIME_PERIODS.YEARLY)).toBe(0);
  });

  it('returns annual footprint for yearly period', () => {
    expect(getFootprintForPeriod(calculation, TIME_PERIODS.YEARLY)).toBe(3650);
  });

  it('returns monthly footprint for monthly period', () => {
    expect(getFootprintForPeriod(calculation, TIME_PERIODS.MONTHLY)).toBe(304.17);
  });

  it('derives daily footprint from annual total', () => {
    expect(getFootprintForPeriod(calculation, TIME_PERIODS.DAILY)).toBe(10);
  });

  it('derives weekly footprint from annual total', () => {
    expect(getFootprintForPeriod(calculation, TIME_PERIODS.WEEKLY)).toBe(70.2);
  });
});

describe('scaleReductionPercent', () => {
  it('scales base percent relative to 20% target', () => {
    expect(scaleReductionPercent(10, 20)).toBe(10);
    expect(scaleReductionPercent(10, 40)).toBe(20);
  });

  it('rounds to one decimal place', () => {
    expect(scaleReductionPercent(3, 15)).toBe(2.3);
  });
});

describe('shouldUseTonnesUnit', () => {
  it('returns true only for yearly period', () => {
    expect(shouldUseTonnesUnit(TIME_PERIODS.YEARLY)).toBe(true);
    expect(shouldUseTonnesUnit(TIME_PERIODS.MONTHLY)).toBe(false);
    expect(shouldUseTonnesUnit(TIME_PERIODS.WEEKLY)).toBe(false);
    expect(shouldUseTonnesUnit(TIME_PERIODS.DAILY)).toBe(false);
  });
});
