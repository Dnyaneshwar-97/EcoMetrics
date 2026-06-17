import { describe, expect, it } from 'vitest';
import { validateNumber, validateCalculatorInputs, validatePlannerTarget } from '../utils/validators';
import { INPUT_LIMITS, VEHICLE_TYPES, FOOD_TYPES } from '../constants/emissionFactors';

describe('validateNumber', () => {
  it('returns valid for number within range', () => {
    expect(validateNumber(5, 0, 10)).toEqual({ valid: true, value: 5 });
  });

  it('returns error for non-numeric input', () => {
    expect(validateNumber('abc', 0, 10)).toEqual({
      valid: false,
      error: { key: 'validation.invalidNumber' },
    });
  });

  it('returns error for number below min', () => {
    expect(validateNumber(-1, 0, 10)).toEqual({
      valid: false,
      error: { key: 'validation.minValue', params: { min: 0 } },
    });
  });

  it('returns error for number above max', () => {
    expect(validateNumber(11, 0, 10)).toEqual({
      valid: false,
      error: { key: 'validation.maxValue', params: { max: 10 } },
    });
  });

  it('handles string numbers correctly', () => {
    expect(validateNumber('5', 0, 10)).toEqual({ valid: true, value: 5 });
  });
});

describe('validateCalculatorInputs', () => {
  const validInputs = {
    electricityKwh: 100,
    vehicleType: VEHICLE_TYPES.PETROL_CAR,
    monthlyDistanceKm: 500,
    domesticFlights: 0,
    internationalFlights: 0,
    foodType: FOOD_TYPES.MIXED,
    weeklyWasteKg: 5,
    householdSize: 2,
  };

  it('returns valid for all valid inputs', () => {
    expect(validateCalculatorInputs(validInputs)).toEqual({ isValid: true, errors: {} });
  });

  it('returns errors for invalid electricity', () => {
    const inputs = { ...validInputs, electricityKwh: INPUT_LIMITS.MAX_ELECTRICITY_KWH + 1 };
    const result = validateCalculatorInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors.electricityKwh).toEqual({
      key: 'validation.maxValue',
      params: { max: INPUT_LIMITS.MAX_ELECTRICITY_KWH },
    });
  });

  it('returns errors for invalid vehicle type', () => {
    const inputs = { ...validInputs, vehicleType: 'invalid_type' };
    const result = validateCalculatorInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors.vehicleType).toEqual({ key: 'validation.invalidVehicleType' });
  });

  it('returns errors for invalid food type', () => {
    const inputs = { ...validInputs, foodType: 'invalid_food' };
    const result = validateCalculatorInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors.foodType).toEqual({ key: 'validation.invalidFoodType' });
  });

  it('returns multiple errors for multiple invalid inputs', () => {
    const inputs = {
      ...validInputs,
      electricityKwh: -1,
      monthlyDistanceKm: INPUT_LIMITS.MAX_DISTANCE_KM + 1,
      householdSize: INPUT_LIMITS.MIN_HOUSEHOLD_SIZE - 1,
      vehicleType: 'invalid',
    };
    const result = validateCalculatorInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).length).toBe(4);
    expect(result.errors.electricityKwh).toEqual({ key: 'validation.minValue', params: { min: 0 } });
    expect(result.errors.monthlyDistanceKm).toEqual({
      key: 'validation.maxValue',
      params: { max: INPUT_LIMITS.MAX_DISTANCE_KM },
    });
    expect(result.errors.householdSize).toEqual({
      key: 'validation.minValue',
      params: { min: INPUT_LIMITS.MIN_HOUSEHOLD_SIZE },
    });
    expect(result.errors.vehicleType).toEqual({ key: 'validation.invalidVehicleType' });
  });
});

describe('validatePlannerTarget', () => {
  it('returns valid for target within range', () => {
    expect(validatePlannerTarget(50)).toEqual({ valid: true, value: 50 });
  });

  it('returns error for non-numeric input', () => {
    expect(validatePlannerTarget('abc')).toEqual({
      valid: false,
      error: { key: 'validation.invalidPercentage' },
    });
  });

  it('returns error for target below 1', () => {
    expect(validatePlannerTarget(0)).toEqual({
      valid: false,
      error: { key: 'validation.targetRange' },
    });
  });

  it('returns error for target above 100', () => {
    expect(validatePlannerTarget(101)).toEqual({
      valid: false,
      error: { key: 'validation.targetRange' },
    });
  });
});
