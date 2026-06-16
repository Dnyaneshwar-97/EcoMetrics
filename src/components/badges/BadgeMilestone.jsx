import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, Lock } from 'lucide-react';
import { getIcon } from '../../utils/icons';
import { kebabToCamel } from '../../utils/i18nHelpers';
import { BADGE_STATUS } from '../../constants/badges';
import SparkleRing from './SparkleRing';

const VARIANTS = {
  hero: {
    wrapper: 'max-w-full w-full',
    card: 'p-6 md:p-8 rounded-3xl',
    iconWrap: 'p-5 rounded-full mb-5',
    icon: 'w-12 h-12 md:w-14 md:h-14',
    title: 'text-xl md:text-2xl',
    desc: 'text-sm md:text-base',
    status: 'text-sm px-3 py-1',
    nextLabel: 'text-xs md:text-sm -top-10',
  },
  peek: {
    wrapper: 'max-w-full w-full',
    card: 'p-3 rounded-2xl',
    iconWrap: 'p-2 rounded-full mb-2',
    icon: 'w-5 h-5',
    title: 'text-xs truncate',
    desc: 'hidden',
    status: 'text-[10px] px-1.5 py-0.5',
    nextLabel: 'hidden',
  },
};

const BadgeMilestone = ({
  badge,
  isNextMilestone,
  isNewlyUnlocked,
  showCheckmark,
  variant = 'hero',
  exportId,
}) => {
  const { t } = useTranslation();
  const IconComponent = getIcon(badge.icon);
  const key = kebabToCamel(badge.id);
  const isEarned = badge.status === BADGE_STATUS.EARNED;
  const isLocked = !isEarned;
  const isHero = variant === 'hero';
  const styles = VARIANTS[variant] ?? VARIANTS.hero;

  return (
    <div className={`relative flex flex-col items-center text-center ${styles.wrapper}`}>
      {isNextMilestone && isHero && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full bg-amber-100/90 dark:bg-amber-900/40 border border-amber-300/60 dark:border-amber-700/50 ${styles.nextLabel}`}
        >
          {t('badgesPage.nextMilestone')}
        </motion.span>
      )}

      <motion.div
        id={exportId}
        className={`relative w-full border-2 ${styles.card} ${
          isEarned
            ? 'border-emerald-400/80 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-[0_0_24px_rgba(16,185,129,0.35)]'
            : isNextMilestone && isHero
              ? 'border-amber-400/70 bg-slate-50 dark:bg-slate-800/80 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
              : 'border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 grayscale-[0.6]'
        }`}
        initial={isNewlyUnlocked && isHero ? { scale: 0.8, opacity: 0.5 } : false}
        animate={
          isHero && isEarned
            ? {
                scale: isNewlyUnlocked ? [0.8, 1.08, 1] : 1,
                y: isNewlyUnlocked ? 0 : [0, -4, 0],
              }
            : isHero && isNextMilestone
              ? { scale: [1, 1.03, 1] }
              : isHero
                ? { scale: [1, 1.015, 1], opacity: [0.85, 1, 0.85] }
                : { scale: 1, opacity: 0.55 }
        }
        transition={
          isHero && isEarned
            ? {
                scale: { duration: isNewlyUnlocked ? 0.7 : 0, type: 'spring', bounce: 0.45 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }
            : isHero
              ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
        }
      >
        {isNextMilestone && isHero && <SparkleRing />}

        <div
          className={`relative inline-flex ${styles.iconWrap} ${
            isEarned
              ? 'bg-emerald-100 dark:bg-emerald-900/50'
              : isNextMilestone && isHero
                ? 'bg-amber-100 dark:bg-amber-900/30'
                : 'bg-slate-100 dark:bg-slate-700/80'
          }`}
        >
          <IconComponent
            className={`${styles.icon} ${
              isEarned
                ? 'text-emerald-600 dark:text-emerald-400'
                : isNextMilestone && isHero
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-400 dark:text-slate-500'
            }`}
            aria-hidden="true"
          />

          {isLocked && isHero && (
            <motion.div
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-200 dark:bg-slate-600 border border-slate-300 dark:border-slate-500"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" aria-hidden="true" />
            </motion.div>
          )}

          {isEarned && showCheckmark && isHero && (
            <motion.div
              className="absolute -top-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Check className="w-4 h-4 text-white" aria-hidden="true" />
            </motion.div>
          )}
        </div>

        <h4 className={`font-semibold text-slate-900 dark:text-white leading-tight mb-1 ${styles.title}`}>
          {t(`badges.${key}.name`)}
        </h4>
        {styles.desc !== 'hidden' && (
          <p className={`text-slate-500 dark:text-slate-400 leading-snug mb-3 ${styles.desc}`}>
            {t(`badges.${key}.description`)}
          </p>
        )}
        <span
          className={`inline-block font-medium rounded-full ${styles.status} ${
            isEarned
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {isEarned ? t('badges.earned') : t('badges.locked')}
        </span>
      </motion.div>
    </div>
  );
};

export default BadgeMilestone;
