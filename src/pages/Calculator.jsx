import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, Calculator, Leaf } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ImpactCard from '../components/cards/ImpactCard';
import RecommendationCard from '../components/cards/RecommendationCard';
import TipsCarousel from '../components/sections/TipsCarousel';
import { calculateFootprint, createCalculationRecord, DEFAULT_INPUTS } from '../services/carbonCalculatorService';
import { generateRecommendations } from '../services/recommendationService';
import { useCarbonData } from '../hooks/useLocalStorage';
import { validateCalculatorInputs } from '../utils/validators';
import { formatCo2 } from '../utils/formatters';
import { VEHICLE_TYPES, FOOD_TYPES } from '../constants/emissionFactors';

const VEHICLE_OPTIONS = [
  { value: VEHICLE_TYPES.PETROL_CAR, label: 'Petrol Car' },
  { value: VEHICLE_TYPES.DIESEL_CAR, label: 'Diesel Car' },
  { value: VEHICLE_TYPES.ELECTRIC_VEHICLE, label: 'Electric Vehicle' },
  { value: VEHICLE_TYPES.MOTORCYCLE, label: 'Motorcycle' },
  { value: VEHICLE_TYPES.PUBLIC_TRANSPORT, label: 'Public Transport' },
];

const FOOD_OPTIONS = [
  { value: FOOD_TYPES.VEGAN, label: 'Vegan' },
  { value: FOOD_TYPES.VEGETARIAN, label: 'Vegetarian' },
  { value: FOOD_TYPES.MIXED, label: 'Mixed Diet' },
  { value: FOOD_TYPES.HIGH_MEAT, label: 'High Meat Consumption' },
];

const CalculatorPage = () => {
  const { saveCalculation } = useCarbonData();
  const [inputs, setInputs] = useState({ ...DEFAULT_INPUTS });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const result = useMemo(() => calculateFootprint(inputs), [inputs]);
  const recommendations = useMemo(() => generateRecommendations(result), [result]);

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    const validation = validateCalculatorInputs(inputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    const record = createCalculationRecord(inputs);
    saveCalculation(record);
    setSaved(true);
  }, [inputs, saveCalculation]);

  const impact = result.environmentalImpact;

  return (
    <PageWrapper className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="section-title mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8 text-emerald-600" aria-hidden="true" />
            Carbon Footprint Calculator
          </h1>
          <p className="section-subtitle mx-auto">
            Enter your lifestyle details to calculate your India-specific carbon footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Details</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="electricity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Electricity Usage (kWh)
                  </label>
                  <input
                    id="electricity"
                    type="number"
                    min="0"
                    value={inputs.electricityKwh}
                    onChange={(e) => handleChange('electricityKwh', e.target.value)}
                    className="input-field"
                    aria-invalid={!!errors.electricityKwh}
                  />
                  {errors.electricityKwh && <p className="text-red-500 text-xs mt-1">{errors.electricityKwh}</p>}
                </div>

                <div>
                  <label htmlFor="vehicle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    id="vehicle"
                    value={inputs.vehicleType}
                    onChange={(e) => handleChange('vehicleType', e.target.value)}
                    className="input-field"
                  >
                    {VEHICLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="distance" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Distance Travelled (km)
                  </label>
                  <input
                    id="distance"
                    type="number"
                    min="0"
                    value={inputs.monthlyDistanceKm}
                    onChange={(e) => handleChange('monthlyDistanceKm', e.target.value)}
                    className="input-field"
                    aria-invalid={!!errors.monthlyDistanceKm}
                  />
                  {errors.monthlyDistanceKm && <p className="text-red-500 text-xs mt-1">{errors.monthlyDistanceKm}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="domestic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Domestic Flights/Year
                    </label>
                    <input
                      id="domestic"
                      type="number"
                      min="0"
                      value={inputs.domesticFlights}
                      onChange={(e) => handleChange('domesticFlights', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="international" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      International Flights/Year
                    </label>
                    <input
                      id="international"
                      type="number"
                      min="0"
                      value={inputs.internationalFlights}
                      onChange={(e) => handleChange('internationalFlights', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="food" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Food Habits
                  </label>
                  <select
                    id="food"
                    value={inputs.foodType}
                    onChange={(e) => handleChange('foodType', e.target.value)}
                    className="input-field"
                  >
                    {FOOD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="waste" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Weekly Waste Generated (kg)
                  </label>
                  <input
                    id="waste"
                    type="number"
                    min="0"
                    value={inputs.weeklyWasteKg}
                    onChange={(e) => handleChange('weeklyWasteKg', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="household" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Household Size (members)
                  </label>
                  <input
                    id="household"
                    type="number"
                    min="1"
                    max="20"
                    value={inputs.householdSize}
                    onChange={(e) => handleChange('householdSize', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              key={result.monthlyFootprintKg}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Your Carbon Footprint
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Monthly</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCo2(result.monthlyFootprintKg)}
                  </p>
                </div>
                <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Annual</p>
                  <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                    {result.annualFootprintTonnes} tonnes CO₂
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                <Badge category={result.scoreCategory} score={result.score} size="lg" />
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="w-5 h-5" aria-hidden="true" />
                {saved ? 'Saved Successfully!' : 'Save Calculation'}
              </Button>
            </motion.div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Environmental Impact
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Your emissions require <strong>{impact.treesRequired} trees</strong> annually for offset.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ImpactCard title="Trees Required" value={impact.treesRequired} unit="trees/year" icon="TreePine" index={0} />
                <ImpactCard title="Km Driven" value={impact.kmDriven} unit="km equivalent" icon="Car" index={1} />
                <ImpactCard title="Coal Burned" value={impact.coalBurned} unit="kg coal" icon="Flame" index={2} />
                <ImpactCard title="Phone Charges" value={impact.smartphoneCharges} unit="charges" icon="Smartphone" index={3} />
                <ImpactCard title="Electricity" value={impact.electricityKwh} unit="kWh equivalent" icon="Zap" index={4} />
              </div>
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Smart Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <RecommendationCard key={rec.id} recommendation={rec} index={index} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 max-w-2xl mx-auto">
          <TipsCarousel />
        </div>
      </div>
    </PageWrapper>
  );
};

export default CalculatorPage;
