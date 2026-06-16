import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getIcon } from '../../utils/icons';
import { kebabToCamel } from '../../utils/i18nHelpers';
import { BADGE_STATUS } from '../../constants/badges';

const BadgeDisplay = ({ badges, compact = false, exportId }) => {
  const { t } = useTranslation();

  if (!badges?.length) return null;

  return (
    <div id={exportId} className="bg-white dark:bg-slate-900 p-2 rounded-2xl">
      <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-4`}>
      {badges.map((badge, index) => {
        const IconComponent = getIcon(badge.icon);
        const isEarned = badge.status === BADGE_STATUS.EARNED;
        const key = kebabToCamel(badge.id);

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-4 text-center transition-all duration-300 ${
              isEarned ? 'ring-2 ring-emerald-500' : 'opacity-50 grayscale'
            }`}
          >
            <div
              className={`inline-flex p-3 rounded-full mb-3 ${
                isEarned
                  ? 'bg-emerald-100 dark:bg-emerald-900/30'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <IconComponent
                className={`w-6 h-6 ${
                  isEarned ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              {t(`badges.${key}.name`)}
            </h4>
            {!compact && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t(`badges.${key}.description`)}
              </p>
            )}
            <span
              className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                isEarned
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {isEarned ? t('badges.earned') : t('badges.locked')}
            </span>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
};

export default BadgeDisplay;
