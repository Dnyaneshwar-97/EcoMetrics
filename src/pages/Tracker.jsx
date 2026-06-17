import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Plus } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import TrackerCard from '../components/cards/TrackerCard';
import Button from '../components/ui/Button';
import { useCarbonData } from '../hooks/useLocalStorage';
import { filterByPeriod } from '../utils/formatters';
import { calculateImprovement, getFootprintForPeriod } from '../utils/calculations';
import { TIME_PERIODS, ROUTES } from '../constants/ui';

const PERIOD_VALUES = [
  TIME_PERIODS.DAILY,
  TIME_PERIODS.WEEKLY,
  TIME_PERIODS.MONTHLY,
  TIME_PERIODS.YEARLY,
];

const Tracker = () => {
  const { t } = useTranslation();
  const { calculations, deleteCalculation, loading } = useCarbonData();
  const [period, setPeriod] = useState(TIME_PERIODS.YEARLY);

  const filteredCalculations = useMemo(
    () => filterByPeriod(calculations, period),
    [calculations, period]
  );

  const getImprovement = (index) => {
    if (index >= filteredCalculations.length - 1) return null;
    const current = filteredCalculations[index];
    const previous = filteredCalculations[index + 1];
    return calculateImprovement(
      getFootprintForPeriod(current, period),
      getFootprintForPeriod(previous, period)
    );
  };

  if (loading) {
    return (
      <PageWrapper className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500">{t('common.loading')}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title mb-2 flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-emerald-600" aria-hidden="true" />
              {t('tracker.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{t('tracker.subtitle')}</p>
          </div>
          <Button to={ROUTES.CALCULATOR}>
            <Plus className="w-5 h-5" aria-hidden="true" />
            {t('tracker.newCalculation')}
          </Button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {PERIOD_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              aria-pressed={period === value}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                period === value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t(`tracker.periods.${value}`)}
            </button>
          ))}
        </div>

        {filteredCalculations.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {calculations.length === 0 ? t('tracker.emptyTitle') : t('tracker.emptyPeriodTitle')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {calculations.length === 0
                ? t('tracker.emptyDesc')
                : t('tracker.emptyPeriodDesc', { period: t(`tracker.periods.${period}`) })}
            </p>
            <Button to={ROUTES.CALCULATOR}>
              {calculations.length === 0 ? t('tracker.calculateNow') : t('tracker.newCalculation')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCalculations.map((calc, index) => (
              <TrackerCard
                key={calc.id}
                calculation={calc}
                period={period}
                improvement={getImprovement(index)}
                onDelete={deleteCalculation}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Tracker;
