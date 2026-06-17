import { PLANNER_TASKS } from '../constants/recommendations';
import { CONVERSION_FACTORS } from '../constants/emissionFactors';
import { scaleReductionPercent, generateId } from '../utils/calculations';

/**
 * Generate a personalized reduction plan based on target percentage
 */
export const generatePlan = (targetPercent, baseFootprintKg) => {
  const tasks = PLANNER_TASKS.map((task, index) => ({
    id: generateId(),
    week: task.week,
    task: task.task,
    category: task.category,
    reductionPercent: scaleReductionPercent(task.reductionPercent, targetPercent),
    completed: false,
    order: index,
  }));

  const totalReductionPercent = tasks.reduce((sum, t) => sum + t.reductionPercent, 0);
  const expectedReductionKg = Math.round((baseFootprintKg * totalReductionPercent) / 100);
  const treesSaved = Math.ceil(expectedReductionKg / CONVERSION_FACTORS.KG_CO2_PER_TREE_YEAR);

  return {
    id: generateId(),
    targetPercent,
    baseFootprintKg,
    tasks,
    expectedReductionKg,
    treesSaved,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Toggle task completion status
 */
export const toggleTaskCompletion = (plan, taskId) => {
  if (!plan) return plan;

  const updatedTasks = plan.tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  return { ...plan, tasks: updatedTasks };
};

/**
 * Update task text
 */
export const updateTask = (plan, taskId, newText) => {
  if (!plan || !newText?.trim()) return plan;

  const updatedTasks = plan.tasks.map((task) =>
    task.id === taskId ? { ...task, task: newText.trim() } : task
  );

  return { ...plan, tasks: updatedTasks };
};

/**
 * Calculate plan progress statistics
 */
export const calculatePlanProgress = (plan) => {
  if (!plan?.tasks?.length) {
    return { completedCount: 0, totalCount: 0, progressPercent: 0, achievedReductionKg: 0 };
  }

  const completedTasks = plan.tasks.filter((t) => t.completed);
  const completedCount = completedTasks.length;
  const totalCount = plan.tasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const achievedReductionPercent = completedTasks.reduce((sum, t) => sum + t.reductionPercent, 0);
  const achievedReductionKg = Math.round((plan.baseFootprintKg * achievedReductionPercent) / 100);

  return {
    completedCount,
    totalCount,
    progressPercent,
    achievedReductionKg,
    achievedReductionPercent,
  };
};

/**
 * Group tasks by week
 */
export const groupTasksByWeek = (tasks) => {
  if (!tasks?.length) return {};

  return tasks.reduce((groups, task) => {
    const week = task.week;
    if (!groups[week]) groups[week] = [];
    groups[week].push(task);
    return groups;
  }, {});
};
