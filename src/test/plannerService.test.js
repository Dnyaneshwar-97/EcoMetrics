import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  generatePlan,
  toggleTaskCompletion,
  updateTask,
  calculatePlanProgress,
  groupTasksByWeek,
} from '../services/plannerService';
import { PLANNER_TASKS } from '../constants/recommendations';
import * as calculations from '../utils/calculations';

vi.mock('../utils/calculations', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    generateId: vi.fn(() => 'mock-id'),
  };
});

describe('plannerService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1));
    vi.mocked(calculations.generateId).mockReturnValue('mock-id');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('generatePlan creates a plan with scaled tasks and metadata', () => {
    const targetPercent = 20;
    const baseFootprintKg = 1000;
    const plan = generatePlan(targetPercent, baseFootprintKg);

    expect(plan.id).toBe('mock-id');
    expect(plan.targetPercent).toBe(targetPercent);
    expect(plan.baseFootprintKg).toBe(baseFootprintKg);
    expect(plan.createdAt).toBe(new Date(2026, 0, 1).toISOString());
    expect(plan.tasks).toHaveLength(PLANNER_TASKS.length);
    expect(plan.tasks[0].completed).toBe(false);

    const totalScaledReduction = PLANNER_TASKS.reduce(
      (sum, task) => sum + calculations.scaleReductionPercent(task.reductionPercent, targetPercent),
      0
    );
    expect(plan.expectedReductionKg).toBe(Math.round((baseFootprintKg * totalScaledReduction) / 100));
    expect(plan.treesSaved).toBe(Math.ceil(plan.expectedReductionKg / 21));
  });

  it('toggleTaskCompletion toggles the completed status of a task', () => {
    const plan = generatePlan(10, 500);
    const taskId = plan.tasks[0].id;

    const updatedPlan = toggleTaskCompletion(plan, taskId);
    expect(updatedPlan.tasks[0].completed).toBe(true);

    const secondUpdate = toggleTaskCompletion(updatedPlan, taskId);
    expect(secondUpdate.tasks[0].completed).toBe(false);
  });

  it('toggleTaskCompletion returns original plan if task not found', () => {
    const plan = generatePlan(10, 500);
    const updatedPlan = toggleTaskCompletion(plan, 'non-existent-id');
    expect(updatedPlan).toEqual(plan);
  });

  it('updateTask changes the task text', () => {
    const plan = generatePlan(10, 500);
    const taskId = plan.tasks[0].id;
    const newText = 'Updated Task Text';

    const updatedPlan = updateTask(plan, taskId, newText);
    expect(updatedPlan.tasks[0].task).toBe(newText);
  });

  it('updateTask returns original plan if task not found or newText is empty', () => {
    const plan = generatePlan(10, 500);
    let updatedPlan = updateTask(plan, 'non-existent-id', 'new text');
    expect(updatedPlan).toEqual(plan);

    updatedPlan = updateTask(plan, plan.tasks[0].id, '');
    expect(updatedPlan).toEqual(plan);
  });

  describe('calculatePlanProgress', () => {
    it('returns 0 progress for an empty plan', () => {
      const progress = calculatePlanProgress(null);
      expect(progress).toEqual({
        completedCount: 0,
        totalCount: 0,
        progressPercent: 0,
        achievedReductionKg: 0,
      });
    });

    it('calculates progress correctly with completed tasks', () => {
      const plan = generatePlan(10, 500);
      plan.tasks[0].completed = true;

      const progress = calculatePlanProgress(plan);
      expect(progress.completedCount).toBe(1);
      expect(progress.totalCount).toBe(PLANNER_TASKS.length);
      expect(progress.progressPercent).toBe(Math.round((1 / PLANNER_TASKS.length) * 100));
    });

    it('calculates 100% progress when all tasks are complete', () => {
      const plan = generatePlan(10, 500);
      plan.tasks.forEach((task) => {
        task.completed = true;
      });

      const progress = calculatePlanProgress(plan);
      expect(progress.completedCount).toBe(PLANNER_TASKS.length);
      expect(progress.totalCount).toBe(PLANNER_TASKS.length);
      expect(progress.progressPercent).toBe(100);
    });
  });

  describe('groupTasksByWeek', () => {
    it('returns an empty object for null or empty tasks', () => {
      expect(groupTasksByWeek(null)).toEqual({});
      expect(groupTasksByWeek([])).toEqual({});
    });

    it('groups tasks by their week number', () => {
      const plan = generatePlan(10, 500);
      const grouped = groupTasksByWeek(plan.tasks);

      expect(Object.keys(grouped).length).toBeGreaterThan(0);
      expect(grouped[plan.tasks[0].week]).toBeDefined();
    });
  });
});
