import {
  AVERAGE_INDIAN_FOOTPRINT_TONNES,
  CONVERSION_FACTORS,
  SCORE_THRESHOLDS,
  SCORE_CATEGORIES,
  DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
} from '../constants/emissionFactors';
import { TIME_PERIODS } from '../constants/ui';

/**
 * Clamp a value between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Calculate carbon score (0-100) based on annual footprint
 */
export const calculateScore = (annualFootprintTonnes) => {
  const rawScore = 100 - (annualFootprintTonnes / AVERAGE_INDIAN_FOOTPRINT_TONNES) * 50;
  return Math.round(clamp(rawScore, 0, 100));
};

/**
 * Get score category label
 */
export const getScoreCategory = (score) => {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return SCORE_CATEGORIES.EXCELLENT;
  if (score >= SCORE_THRESHOLDS.GOOD) return SCORE_CATEGORIES.GOOD;
  if (score >= SCORE_THRESHOLDS.MODERATE) return SCORE_CATEGORIES.MODERATE;
  if (score >= SCORE_THRESHOLDS.HIGH) return SCORE_CATEGORIES.HIGH;
  return SCORE_CATEGORIES.CRITICAL;
};

/**
 * Convert annual kg CO2 to environmental equivalents
 */
export const calculateEnvironmentalImpact = (annualKgCo2) => {
  const treesRequired = Math.ceil(annualKgCo2 / CONVERSION_FACTORS.KG_CO2_PER_TREE_YEAR);
  const kmDriven = Math.round(annualKgCo2 / CONVERSION_FACTORS.KG_CO2_PER_KM_PETROL);
  const coalBurned = Math.round((annualKgCo2 / CONVERSION_FACTORS.KG_CO2_PER_KG_COAL) * 10) / 10;
  const smartphoneCharges = Math.round(annualKgCo2 / CONVERSION_FACTORS.KG_CO2_PER_SMARTPHONE_CHARGE);
  const electricityKwh = Math.round(annualKgCo2 / CONVERSION_FACTORS.KWH_PER_KG_CO2);

  return {
    treesRequired,
    kmDriven,
    coalBurned,
    smartphoneCharges,
    electricityKwh,
  };
};

/**
 * Calculate improvement percentage between two footprints
 */
export const calculateImprovement = (currentFootprint, previousFootprint) => {
  if (!previousFootprint || previousFootprint === 0) return 0;
  const improvement = ((previousFootprint - currentFootprint) / previousFootprint) * 100;
  return Math.round(improvement * 10) / 10;
};

/**
 * Generate unique ID
 */
export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * Convert kg to tonnes
 */
export const kgToTonnes = (kg) => Math.round((kg / 1000) * 100) / 100;

/**
 * Scale planner tasks based on target reduction percentage
 */
export const scaleReductionPercent = (basePercent, targetPercent) => {
  const scaleFactor = targetPercent / 20;
  return Math.round(basePercent * scaleFactor * 10) / 10;
};

/** Display labels for tracker time periods */
export const PERIOD_LABELS = {
  [TIME_PERIODS.DAILY]: 'Daily',
  [TIME_PERIODS.WEEKLY]: 'Weekly',
  [TIME_PERIODS.MONTHLY]: 'Monthly',
  [TIME_PERIODS.YEARLY]: 'Annual',
};

/**
 * Derive footprint (kg CO₂) for a given time period from a saved calculation
 */
export const getFootprintForPeriod = (calculation, period) => {
  if (!calculation) return 0;

  const { annualFootprintKg, monthlyFootprintKg } = calculation;

  switch (period) {
    case TIME_PERIODS.DAILY:
      return Math.round((annualFootprintKg / DAYS_PER_YEAR) * 100) / 100;
    case TIME_PERIODS.WEEKLY:
      return Math.round((annualFootprintKg / WEEKS_PER_YEAR) * 10) / 10;
    case TIME_PERIODS.MONTHLY:
      return monthlyFootprintKg;
    case TIME_PERIODS.YEARLY:
    default:
      return annualFootprintKg;
  }
};

/**
 * Whether footprint should be displayed in tonnes (yearly view only)
 */
export const shouldUseTonnesUnit = (period) => period === TIME_PERIODS.YEARLY;
