import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Target, TreePine } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import PlannerCard from '../components/cards/PlannerCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useCarbonData } from '../hooks/useLocalStorage';
import {
  generatePlan,
  toggleTaskCompletion,
  updateTask,
  calculatePlanProgress,
  groupTasksByWeek,
} from '../services/plannerService';
import { validatePlannerTarget } from '../utils/validators';
import { formatCo2 } from '../utils/formatters';
import { PLANNER_TARGETS, ROUTES } from '../constants/ui';

const Planner = () => {
  const { latestCalculation, plan, savePlan } = useCarbonData();
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [customTarget, setCustomTarget] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customError, setCustomError] = useState('');

  const progress = useMemo(() => calculatePlanProgress(plan), [plan]);
  const tasksByWeek = useMemo(() => groupTasksByWeek(plan?.tasks ?? []), [plan]);

  const handleGeneratePlan = useCallback(
    (targetPercent) => {
      if (!latestCalculation) return;
      const newPlan = generatePlan(targetPercent, latestCalculation.annualFootprintKg);
      savePlan(newPlan);
      setSelectedTarget(null);
      setShowCustomModal(false);
    },
    [latestCalculation, savePlan]
  );

  const handleCustomSubmit = () => {
    const validation = validatePlannerTarget(customTarget);
    if (!validation.valid) {
      setCustomError(validation.error);
      return;
    }
    handleGeneratePlan(validation.value);
  };

  const handleToggleTask = useCallback(
    (taskId) => {
      if (!plan) return;
      savePlan(toggleTaskCompletion(plan, taskId));
    },
    [plan, savePlan]
  );

  const handleEditTask = useCallback(
    (taskId, newText) => {
      if (!plan) return;
      savePlan(updateTask(plan, taskId, newText));
    },
    [plan, savePlan]
  );

  const handleTargetSelect = (target) => {
    if (target === 'custom') {
      setShowCustomModal(true);
      return;
    }
    handleGeneratePlan(target);
  };

  if (!latestCalculation) {
    return (
      <PageWrapper className="py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Target className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Calculate First</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Complete a carbon footprint calculation before creating a reduction plan.
          </p>
          <Link to={ROUTES.CALCULATOR}>
            <Button>Go to Calculator</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="section-title mb-4 flex items-center justify-center gap-3">
            <Target className="w-8 h-8 text-emerald-600" aria-hidden="true" />
            Carbon Reduction Planner
          </h1>
          <p className="section-subtitle mx-auto">
            Set a target and get a personalized weekly plan to reduce your footprint.
          </p>
        </div>

        {!plan ? (
          <div className="glass-card p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Select Your Target Reduction
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Based on your annual footprint of {formatCo2(latestCalculation.annualFootprintKg, 'tonnes')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {PLANNER_TARGETS.map((target) => (
                <Button
                  key={target.value}
                  variant={selectedTarget === target.value ? 'primary' : 'secondary'}
                  onClick={() => handleTargetSelect(target.value)}
                >
                  {target.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-5 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Target Reduction</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{plan.targetPercent}%</p>
              </div>
              <div className="glass-card p-5 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">Expected Reduction</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {formatCo2(plan.expectedReductionKg)}
                </p>
              </div>
              <div className="glass-card p-5 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                  <TreePine className="w-4 h-4" aria-hidden="true" /> Trees Saved
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{plan.treesSaved}</p>
              </div>
            </div>

            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {progress.progressPercent}% ({progress.completedCount}/{progress.totalCount} tasks)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-emerald-500 h-3 rounded-full"
                />
              </div>
              {progress.achievedReductionKg > 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Achieved reduction: {formatCo2(progress.achievedReductionKg)} ({progress.achievedReductionPercent}%)
                </p>
              )}
            </div>

            {Object.entries(tasksByWeek).map(([week, tasks]) => (
              <div key={week} className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Week {week}
                </h3>
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <PlannerCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleEditTask}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center mt-8">
              <Button
                variant="secondary"
                onClick={() => {
                  savePlan(null);
                }}
              >
                Create New Plan
              </Button>
            </div>
          </>
        )}

        <Modal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          title="Custom Target"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="custom-target" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Reduction (%)
              </label>
              <input
                id="custom-target"
                type="number"
                min="1"
                max="100"
                value={customTarget}
                onChange={(e) => {
                  setCustomTarget(e.target.value);
                  setCustomError('');
                }}
                className="input-field"
                placeholder="e.g., 25"
              />
              {customError && <p className="text-red-500 text-xs mt-1">{customError}</p>}
            </div>
            <Button onClick={handleCustomSubmit} className="w-full">
              Generate Plan
            </Button>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default Planner;
