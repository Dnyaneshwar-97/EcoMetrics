import { describe, expect, it, vi, beforeEach } from 'vitest';
import { evaluateBadges } from '../services/badgeService';
import { BADGE_DEFINITIONS, BADGE_STATUS } from '../constants/badges';
import * as plannerService from '../services/plannerService';
import * as calculations from '../utils/calculations';

vi.mock('../services/plannerService', () => ({
  calculatePlanProgress: vi.fn(() => ({
    progressPercent: 0,
    completedCount: 0,
    totalCount: 0,
  })),
}));

vi.mock('../utils/calculations', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    calculateImprovement: vi.fn(() => 0),
  };
});

const createMockCalculation = (score, annualFootprintKg) => ({
  id: 'calc-id',
  date: new Date().toISOString(),
  score,
  annualFootprintKg,
});

describe('badgeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(plannerService.calculatePlanProgress).mockReturnValue({
      progressPercent: 0,
      completedCount: 0,
      totalCount: 0,
    });
    vi.mocked(calculations.calculateImprovement).mockReturnValue(0);
  });

  describe('evaluateBadges', () => {
    it('returns all badges with correct status (locked/earned)', () => {
      const calculationsList = [
        createMockCalculation(70, 1000),
        createMockCalculation(80, 1200),
      ];
      const plan = { tasks: [{ completed: true }, { completed: true }] };

      vi.mocked(plannerService.calculatePlanProgress).mockReturnValue({
        progressPercent: 100,
        completedCount: 2,
        totalCount: 2,
      });
      vi.mocked(calculations.calculateImprovement).mockReturnValue(15);

      const badges = evaluateBadges(calculationsList, plan);
      expect(badges).toHaveLength(BADGE_DEFINITIONS.length);
      expect(badges.find((b) => b.id === 'green-starter')?.status).toBe(BADGE_STATUS.EARNED);
      expect(badges.find((b) => b.id === 'eco-learner')?.status).toBe(BADGE_STATUS.EARNED);
      expect(badges.find((b) => b.id === 'eco-warrior')?.status).toBe(BADGE_STATUS.EARNED);
      expect(badges.find((b) => b.id === 'climate-champion')?.status).toBe(BADGE_STATUS.EARNED);
      expect(badges.find((b) => b.id === 'earth-guardian')?.status).toBe(BADGE_STATUS.LOCKED);
    });

    it('handles no calculations or plan gracefully', () => {
      const badges = evaluateBadges([], null);
      expect(badges).toHaveLength(BADGE_DEFINITIONS.length);
      badges.forEach((badge) => {
        expect(badge.status).toBe(BADGE_STATUS.LOCKED);
      });
    });

    it('correctly evaluates Green Starter badge', () => {
      let badges = evaluateBadges([], null);
      expect(badges.find((b) => b.id === 'green-starter')?.status).toBe(BADGE_STATUS.LOCKED);

      badges = evaluateBadges([createMockCalculation(0, 0)], null);
      expect(badges.find((b) => b.id === 'green-starter')?.status).toBe(BADGE_STATUS.EARNED);
    });

    it('correctly evaluates Eco Learner badge', () => {
      let badges = evaluateBadges([createMockCalculation(59, 0)], null);
      expect(badges.find((b) => b.id === 'eco-learner')?.status).toBe(BADGE_STATUS.LOCKED);

      badges = evaluateBadges([createMockCalculation(60, 0)], null);
      expect(badges.find((b) => b.id === 'eco-learner')?.status).toBe(BADGE_STATUS.EARNED);
    });

    it('correctly evaluates Eco Warrior badge', () => {
      vi.mocked(plannerService.calculatePlanProgress).mockReturnValue({
        progressPercent: 49,
        completedCount: 1,
        totalCount: 2,
      });
      let badges = evaluateBadges([createMockCalculation(0, 0)], { tasks: [] });
      expect(badges.find((b) => b.id === 'eco-warrior')?.status).toBe(BADGE_STATUS.LOCKED);

      vi.mocked(plannerService.calculatePlanProgress).mockReturnValue({
        progressPercent: 50,
        completedCount: 1,
        totalCount: 2,
      });
      badges = evaluateBadges([createMockCalculation(0, 0)], { tasks: [] });
      expect(badges.find((b) => b.id === 'eco-warrior')?.status).toBe(BADGE_STATUS.EARNED);
    });

    it('correctly evaluates Climate Champion badge', () => {
      vi.mocked(calculations.calculateImprovement).mockReturnValue(9);
      let badges = evaluateBadges(
        [createMockCalculation(0, 0), createMockCalculation(0, 0)],
        null
      );
      expect(badges.find((b) => b.id === 'climate-champion')?.status).toBe(BADGE_STATUS.LOCKED);

      vi.mocked(calculations.calculateImprovement).mockReturnValue(10);
      badges = evaluateBadges(
        [createMockCalculation(0, 0), createMockCalculation(0, 0)],
        null
      );
      expect(badges.find((b) => b.id === 'climate-champion')?.status).toBe(BADGE_STATUS.EARNED);

      badges = evaluateBadges([createMockCalculation(0, 0)], null);
      expect(badges.find((b) => b.id === 'climate-champion')?.status).toBe(BADGE_STATUS.LOCKED);
    });

    it('correctly evaluates Earth Guardian badge', () => {
      vi.mocked(plannerService.calculatePlanProgress).mockReturnValue({
        progressPercent: 100,
        completedCount: 2,
        totalCount: 2,
      });

      let badges = evaluateBadges([createMockCalculation(79, 0)], { tasks: [] });
      expect(badges.find((b) => b.id === 'earth-guardian')?.status).toBe(BADGE_STATUS.LOCKED);

      badges = evaluateBadges([createMockCalculation(80, 0)], { tasks: [] });
      expect(badges.find((b) => b.id === 'earth-guardian')?.status).toBe(BADGE_STATUS.EARNED);

      vi.mocked(plannerService.calculatePlanProgress).mockReturnValue({
        progressPercent: 99,
        completedCount: 2,
        totalCount: 2,
      });
      badges = evaluateBadges([createMockCalculation(80, 0)], { tasks: [] });
      expect(badges.find((b) => b.id === 'earth-guardian')?.status).toBe(BADGE_STATUS.LOCKED);
    });
  });
});
