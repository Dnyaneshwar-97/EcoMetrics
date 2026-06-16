import { describe, expect, it, vi } from 'vitest';
import {
  calculateFootprint,
  createCalculationRecord,
  DEFAULT_INPUTS,
} from '../services/carbonCalculatorService';
import { EMISSION_FACTORS, FOOD_EMISSION_MAP, VEHICLE_EMISSION_MAP, FOOD_TYPES, VEHICLE_TYPES } from '../constants/emissionFactors';

vi.mock('../utils/calculations', () => ({
  calculateScore: vi.fn((annualTonnes) => (100 - (annualTonnes / 1.9) * 50)),
  getScoreCategory: vi.fn((score) => (score > 50 ? 'Good' : 'Bad')),
  calculateEnvironmentalImpact: vi.fn((annualKgCo2) => ({ treesRequired: annualKgCo2 / 21 })),
  generateId: vi.fn(() => 'mock-id'),
}));

describe('calculateFootprint', () => {
  it('calculates footprint correctly for default inputs', () => {
    const inputs = DEFAULT_INPUTS;
    const result = calculateFootprint(inputs);

    // Expected monthly emissions for default inputs (approximate)
    const expectedElectricity = inputs.electricityKwh * EMISSION_FACTORS.ELECTRICITY / inputs.householdSize;
    const expectedTransportation = inputs.monthlyDistanceKm * VEHICLE_EMISSION_MAP[inputs.vehicleType];
    const expectedFlights = (inputs.domesticFlights * EMISSION_FACTORS.DOMESTIC_FLIGHT + inputs.internationalFlights * EMISSION_FACTORS.INTERNATIONAL_FLIGHT) / 12;
    const expectedFood = FOOD_EMISSION_MAP[inputs.foodType] * 365 / 12;
    const expectedWaste = inputs.weeklyWasteKg * 52 * EMISSION_FACTORS.WASTE / 12 / inputs.householdSize;

    const expectedMonthlyTotal = expectedElectricity + expectedTransportation + expectedFlights + expectedFood + expectedWaste;
    const expectedAnnualKg = expectedMonthlyTotal * 12;
    const expectedAnnualTonnes = Math.round((expectedAnnualKg / 1000) * 100) / 100;

    expect(result.monthlyFootprintKg).toBeCloseTo(expectedMonthlyTotal, 0);
    expect(result.annualFootprintKg).toBeCloseTo(expectedAnnualKg, 0);
    expect(result.annualFootprintTonnes).toBe(expectedAnnualTonnes);
    expect(result.score).toBeDefined();
    expect(result.scoreCategory).toBeDefined();
    expect(result.environmentalImpact).toBeDefined();
    expect(result.categories.electricity).toBeCloseTo(expectedElectricity, 0);
  });

  it('overrides default inputs with provided values', () => {
    const customInputs = {
      electricityKwh: 50,
      householdSize: 1,
      foodType: FOOD_TYPES.VEGAN,
    };
    const result = calculateFootprint(customInputs);

    const expectedElectricity = customInputs.electricityKwh * EMISSION_FACTORS.ELECTRICITY / customInputs.householdSize;
    const expectedFood = FOOD_EMISSION_MAP[customInputs.foodType] * 365 / 12;

    expect(result.inputs.electricityKwh).toBe(customInputs.electricityKwh);
    expect(result.inputs.householdSize).toBe(customInputs.householdSize);
    expect(result.inputs.foodType).toBe(customInputs.foodType);
    expect(result.categories.electricity).toBeCloseTo(expectedElectricity, 0);
    expect(result.categories.food).toBeCloseTo(expectedFood, 0);
  });
});

describe('createCalculationRecord', () => {
  it('creates a record with an ID and date', () => {
    const inputs = {
      electricityKwh: 100,
      vehicleType: VEHICLE_TYPES.PETROL_CAR,
      monthlyDistanceKm: 500,
      domesticFlights: 0,
      internationalFlights: 0,
      foodType: FOOD_TYPES.MIXED,
      weeklyWasteKg: 5,
      householdSize: 2,
    };
    const record = createCalculationRecord(inputs);

    expect(record.id).toBe('mock-id');
    expect(record.date).toBeDefined();
    expect(record.monthlyFootprintKg).toBeDefined();
    expect(record.annualFootprintTonnes).toBeDefined();
  });
});
