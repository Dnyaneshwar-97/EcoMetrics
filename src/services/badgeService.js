import { BADGE_DEFINITIONS, BADGE_STATUS } from '../constants/badges';
import { calculatePlanProgress } from './plannerService';
import { calculateImprovement } from '../utils/calculations';

/**
 * Evaluate if a badge criterion is met
 */
const evaluateCriteria = (badge, data) => {
  const { criteria } = badge;
  const { calculations, latestScore, plan } = data;

  switch (criteria.type) {
    case 'calculations':
      return calculations.length >= criteria.count;

    case 'score':
      return latestScore >= criteria.minScore;

    case 'plannerProgress': {
      const progress = calculatePlanProgress(plan);
      return progress.progressPercent >= criteria.percentage;
    }

    case 'reduction': {
      if (calculations.length < 2) return false;
      const first = calculations[calculations.length - 1];
      const latest = calculations[0];
      const improvement = calculateImprovement(
        latest.annualFootprintKg,
        first.annualFootprintKg
      );
      return improvement >= criteria.percentage;
    }

    case 'combined': {
      const progress = calculatePlanProgress(plan);
      return latestScore >= criteria.minScore && progress.progressPercent === 100;
    }

    default:
      return false;
  }
};

/**
 * Evaluate all badges and return status
 */
export const evaluateBadges = (calculations, plan) => {
  const latestScore = calculations[0]?.score ?? 0;

  const data = { calculations, latestScore, plan };

  return BADGE_DEFINITIONS.map((badge) => {
    const earned = evaluateCriteria(badge, data);
    return {
      ...badge,
      status: earned ? BADGE_STATUS.EARNED : BADGE_STATUS.LOCKED,
      earnedAt: earned ? new Date().toISOString() : null,
    };
  });
};

/**
 * Get count of earned badges
 */
export const getEarnedBadgeCount = (badges) =>
  badges.filter((b) => b.status === BADGE_STATUS.EARNED).length;
