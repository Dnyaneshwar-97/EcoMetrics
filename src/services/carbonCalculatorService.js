import {
  EMISSION_FACTORS,
  VEHICLE_EMISSION_MAP,
  FOOD_EMISSION_MAP,
  MONTHS_PER_YEAR,
  DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
} from '../constants/emissionFactors';
import { calculateScore, getScoreCategory, calculateEnvironmentalImpact, generateId } from '../utils/calculations';

const DEFAULT_INPUTS = {
  electricityKwh: 150,
  vehicleType: 'petrol_car',
  monthlyDistanceKm: 500,
  domesticFlights: 2,
  internationalFlights: 0,
  foodType: 'mixed',
  weeklyWasteKg: 5,
  householdSize: 4,
};

/**
 * Calculate category-wise emissions in kg CO2/month
 */
const calculateCategoryEmissions = (inputs) => {
  const perPersonFactor = 1 / Math.max(inputs.householdSize, 1);

  const electricity = inputs.electricityKwh * EMISSION_FACTORS.ELECTRICITY * perPersonFactor;

  const vehicleFactor = VEHICLE_EMISSION_MAP[inputs.vehicleType] ?? EMISSION_FACTORS.PETROL_CAR;
  const transportation = inputs.monthlyDistanceKm * vehicleFactor;

  const flightsMonthly =
    ((inputs.domesticFlights * EMISSION_FACTORS.DOMESTIC_FLIGHT) +
      (inputs.internationalFlights * EMISSION_FACTORS.INTERNATIONAL_FLIGHT)) /
    MONTHS_PER_YEAR;

  const foodFactor = FOOD_EMISSION_MAP[inputs.foodType] ?? FOOD_EMISSION_MAP.mixed ?? 3.3;
  const food = (foodFactor * DAYS_PER_YEAR) / MONTHS_PER_YEAR;

  const waste = (inputs.weeklyWasteKg * WEEKS_PER_YEAR * EMISSION_FACTORS.WASTE) / MONTHS_PER_YEAR * perPersonFactor;

  return {
    electricity: Math.round(electricity * 10) / 10,
    transportation: Math.round(transportation * 10) / 10,
    flights: Math.round(flightsMonthly * 10) / 10,
    food: Math.round(food * 10) / 10,
    waste: Math.round(waste * 10) / 10,
  };
};

/**
 * Calculate full carbon footprint from user inputs
 */
export const calculateFootprint = (inputs) => {
  const mergedInputs = { ...DEFAULT_INPUTS, ...inputs };
  const categories = calculateCategoryEmissions(mergedInputs);

  const monthlyTotal = Object.values(categories).reduce((sum, val) => sum + val, 0);
  const annualTotalKg = monthlyTotal * MONTHS_PER_YEAR;
  const annualTonnes = Math.round((annualTotalKg / 1000) * 100) / 100;
  const score = calculateScore(annualTonnes);
  const scoreCategory = getScoreCategory(score);
  const environmentalImpact = calculateEnvironmentalImpact(annualTotalKg);

  return {
    monthlyFootprintKg: Math.round(monthlyTotal * 10) / 10,
    annualFootprintKg: Math.round(annualTotalKg * 10) / 10,
    annualFootprintTonnes: annualTonnes,
    score,
    scoreCategory,
    categories,
    environmentalImpact,
    inputs: mergedInputs,
  };
};

/**
 * Create a storable calculation record
 */
export const createCalculationRecord = (inputs) => {
  const result = calculateFootprint(inputs);
  return {
    id: generateId(),
    date: new Date().toISOString(),
    ...result,
  };
};

export { DEFAULT_INPUTS };
