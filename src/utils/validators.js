import { INPUT_LIMITS, FOOD_TYPES, VEHICLE_TYPES } from '../constants/emissionFactors';

const VALID_VEHICLE_TYPES = Object.values(VEHICLE_TYPES);
const VALID_FOOD_TYPES = Object.values(FOOD_TYPES);

/**
 * Validate numeric input within range
 */
export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return { valid: false, error: { key: 'validation.invalidNumber' } };
  }
  if (num < min) {
    return { valid: false, error: { key: 'validation.minValue', params: { min } } };
  }
  if (num > max) {
    return { valid: false, error: { key: 'validation.maxValue', params: { max } } };
  }
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
    errors.vehicleType = { key: 'validation.invalidVehicleType' };
  }

  if (!VALID_FOOD_TYPES.includes(inputs.foodType)) {
    errors.foodType = { key: 'validation.invalidFoodType' };
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
  if (Number.isNaN(num)) {
    return { valid: false, error: { key: 'validation.invalidPercentage' } };
  }
  if (num < 1 || num > 100) {
    return { valid: false, error: { key: 'validation.targetRange' } };
  }
  return { valid: true, value: num };
};
