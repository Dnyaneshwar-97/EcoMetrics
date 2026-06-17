import { RECOMMENDATION_RULES } from '../constants/recommendations';

/**
 * Get monthly category value for threshold comparison
 */
const getCategoryValue = (categories, category, inputs) => {
  if (category === 'electricity') return inputs.electricityKwh ?? 0;
  if (category === 'transportation') return inputs.monthlyDistanceKm ?? 0;
  if (category === 'flights') return (inputs.domesticFlights ?? 0) + (inputs.internationalFlights ?? 0);
  if (category === 'food') {
    const foodMap = { vegan: 1, vegetarian: 2, mixed: 3, high_meat: 4 };
    return foodMap[inputs.foodType] ?? 3;
  }
  if (category === 'waste') return inputs.weeklyWasteKg ?? 0;
  return categories[category] ?? 0;
};

/**
 * Generate personalized recommendations based on calculation results
 */
export const generateRecommendations = (calculationResult) => {
  if (!calculationResult) return [];

  const { categories, inputs } = calculationResult;
  const recommendations = [];

  RECOMMENDATION_RULES.forEach((rule) => {
    const value = getCategoryValue(categories, rule.category, inputs);
    if (value >= rule.threshold) {
      rule.recommendations.forEach((rec) => {
        recommendations.push({
          id: `${rule.id}-${rec.title.toLowerCase().replace(/\s+/g, '-')}`,
          category: rule.category,
          ruleTitle: rule.title,
          ...rec,
        });
      });
    }
  });

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'general-maintain',
      category: 'general',
      ruleTitleKey: 'recommendations.fallbackRuleTitle',
      titleKey: 'recommendations.fallbackTitle',
      descriptionKey: 'recommendations.fallbackDescription',
      co2ReductionKg: 0,
      moneySaved: 0,
      treesEquivalent: 0,
    });
  }

  return recommendations;
};

/**
 * Calculate total potential savings from recommendations
 */
export const calculateTotalSavings = (recommendations) => {
  return recommendations.reduce(
    (totals, rec) => ({
      co2ReductionKg: totals.co2ReductionKg + (rec.co2ReductionKg ?? 0),
      moneySaved: totals.moneySaved + (rec.moneySaved ?? 0),
      treesEquivalent: totals.treesEquivalent + (rec.treesEquivalent ?? 0),
    }),
    { co2ReductionKg: 0, moneySaved: 0, treesEquivalent: 0 }
  );
};
