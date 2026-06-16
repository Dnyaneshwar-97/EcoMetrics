import { INPUT_LIMITS, FOOD_TYPES, VEHICLE_TYPES } from '../constants/emissionFactors';

const VALID_VEHICLE_TYPES = Object.values(VEHICLE_TYPES);
const VALID_FOOD_TYPES = Object.values(FOOD_TYPES);

/**
 * Validate numeric input within range
 */
export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = Number(value);
  if (Number.isNaN(num)) return { valid: false, error: 'Please enter a valid number' };
  if (num < min) return { valid: false, error: `Value must be at least ${min}` };
  if (num > max) return { valid: false, error: `Value must not exceed ${max}` };
  return { valid: true, value: num };
};

/**
 * Validate calculator form inputs
 */
export const validateCalculatorInputs = (inputs) => {
  const errors = {};

  const electricity = validateNumber(inputs.electricityKwh, 0, INPUT_LIMITS.MAX_ELECTRICITY_KWH);
  if (!electricity.valid) errors.electricityKwh = electricity.error;

  const distance = validateNumber(inputs.monthlyDistanceKm, 0, INPUT_LIMITS.MAX_DISTANCE_KM);
  if (!distance.valid) errors.monthlyDistanceKm = distance.error;

  const domesticFlights = validateNumber(inputs.domesticFlights, 0, INPUT_LIMITS.MAX_FLIGHTS);
  if (!domesticFlights.valid) errors.domesticFlights = domesticFlights.error;

  const internationalFlights = validateNumber(inputs.internationalFlights, 0, INPUT_LIMITS.MAX_FLIGHTS);
  if (!internationalFlights.valid) errors.internationalFlights = internationalFlights.error;

  const waste = validateNumber(inputs.weeklyWasteKg, 0, INPUT_LIMITS.MAX_WASTE_KG);
  if (!waste.valid) errors.weeklyWasteKg = waste.error;

  const household = validateNumber(
    inputs.householdSize,
    INPUT_LIMITS.MIN_HOUSEHOLD_SIZE,
    INPUT_LIMITS.MAX_HOUSEHOLD_SIZE
  );
  if (!household.valid) errors.householdSize = household.error;

  if (!VALID_VEHICLE_TYPES.includes(inputs.vehicleType)) {
    errors.vehicleType = 'Please select a valid vehicle type';
  }

  if (!VALID_FOOD_TYPES.includes(inputs.foodType)) {
    errors.foodType = 'Please select a valid food type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate custom planner target
 */
export const validatePlannerTarget = (target) => {
  const num = Number(target);
  if (Number.isNaN(num)) return { valid: false, error: 'Please enter a valid percentage' };
  if (num < 1 || num > 100) return { valid: false, error: 'Target must be between 1% and 100%' };
  return { valid: true, value: num };
};
