import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDateTime, formatCo2 } from '../../utils/formatters';
import { getFootprintForPeriod, shouldUseTonnesUnit } from '../../utils/calculations';

const TrackerCard = ({ calculation, improvement, onDelete, period, index = 0 }) => {
  const { t } = useTranslation();
  const isImproved = improvement > 0;
  const footprintKg = getFootprintForPeriod(calculation, period);
  const useTonnes = shouldUseTonnesUnit(period);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-5 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge category={calculation.scoreCategory} score={calculation.score} size="sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t(`tracker.periods.${period}`)} {t('tracker.footprint')}
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatCo2(footprintKg, useTonnes ? 'tonnes' : 'kg')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('tracker.recorded')}</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatDateTime(calculation.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {improvement !== null && improvement !== 0 && (
            <div className={`flex items-center gap-1 text-sm font-medium ${isImproved ? 'text-emerald-600' : 'text-red-500'}`}>
              {isImproved ? <TrendingDown className="w-4 h-4" aria-hidden="true" /> : <TrendingUp className="w-4 h-4" aria-hidden="true" />}
              {Math.abs(improvement)}%
            </div>
          )}
          <Button variant="danger" size="sm" onClick={() => onDelete(calculation.id)} aria-label={t('tracker.delete')}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrackerCard;
