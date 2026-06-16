import { motion } from 'framer-motion';
import { Check, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

const PlannerCard = ({ task, onToggle, onEdit, index = 0 }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.task);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass-card p-4 flex items-center gap-4 transition-all duration-300 ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          task.completed
            ? 'bg-emerald-600 border-emerald-600 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
        }`}
        aria-label={task.completed ? t('planner.markIncomplete') : t('planner.markComplete')}
        aria-pressed={task.completed}
      >
        {task.completed && <Check className="w-4 h-4" aria-hidden="true" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="input-field flex-1 py-2 text-sm"
              aria-label={t('planner.editTaskInput')}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
            <Button size="sm" onClick={handleSaveEdit}>{t('common.save')}</Button>
          </div>
        ) : (
          <p className={`text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {task.task}
          </p>
        )}
        <span className="text-xs text-emerald-600 dark:text-emerald-400">
          -{task.reductionPercent}% emissions
        </span>
      </div>

      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label={t('planner.editTask')}
        >
          <Edit2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
        </button>
      )}
    </motion.div>
  );
};

export default PlannerCard;
