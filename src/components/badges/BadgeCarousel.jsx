import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Image } from 'lucide-react';
import { useBadgeJourney } from '../../hooks/useBadgeJourney';
import BadgeMilestone from './BadgeMilestone';
import Button from '../ui/Button';
import { BADGE_STATUS } from '../../constants/badges';
import { kebabToCamel } from '../../utils/i18nHelpers';
import {
  buildBadgeSvg,
  downloadSvgBadge,
  downloadPngBadge,
  slugifyBadgeFileName,
} from '../../utils/badgeExport';

const SLIDE_GAP = 24;
const SLIDE_WIDTH_SM = 300;
const SLIDE_WIDTH_MD = 360;
const SWIPE_THRESHOLD = 48;

const BadgeCarousel = ({ badges }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const hasInitialized = useRef(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const {
    nextMilestoneIndex,
    newlyUnlockedId,
    checkmarkIds,
    earnedCount,
    totalCount,
  } = useBadgeJourney(badges);

  const initialIndex = useMemo(() => {
    if (nextMilestoneIndex >= 0) return nextMilestoneIndex;
    return badges.reduce(
      (last, badge, index) => (badge.status === BADGE_STATUS.EARNED ? index : last),
      0
    );
  }, [badges, nextMilestoneIndex]);

  useEffect(() => {
    if (!hasInitialized.current && badges.length > 0) {
      setActiveIndex(initialIndex);
      hasInitialized.current = true;
    }
  }, [badges.length, initialIndex]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const updateWidth = () => setContainerWidth(element.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const slideWidth = containerWidth >= 768 ? SLIDE_WIDTH_MD : SLIDE_WIDTH_SM;
  const step = slideWidth + SLIDE_GAP;

  const trackOffset = useMemo(() => {
    if (!containerWidth) return 0;
    return containerWidth / 2 - activeIndex * step - slideWidth / 2;
  }, [containerWidth, activeIndex, step, slideWidth]);

  const goTo = useCallback(
    (index) => {
      setActiveIndex(Math.max(0, Math.min(badges.length - 1, index)));
    },
    [badges.length]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (event.key === 'ArrowRight') goTo(activeIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, goTo]);

  const handlePanEnd = useCallback(
    (_, info) => {
      if (info.offset.x <= -SWIPE_THRESHOLD) goTo(activeIndex + 1);
      else if (info.offset.x >= SWIPE_THRESHOLD) goTo(activeIndex - 1);
    },
    [activeIndex, goTo]
  );

  const activeBadge = badges[activeIndex];
  const isActiveEarned = activeBadge?.status === BADGE_STATUS.EARNED;
  const canDownload = isActiveEarned && !isExporting;

  const getBadgeExportMeta = useCallback(
    (badge) => {
      const key = kebabToCamel(badge.id);
      const isEarned = badge.status === BADGE_STATUS.EARNED;
      return {
        badgeName: t(`badges.${key}.name`),
        description: t(`badges.${key}.description`),
        statusLabel: isEarned ? t('badges.earned') : t('badges.locked'),
        isEarned,
        fileBase: `ecometrics_${slugifyBadgeFileName(badge.id)}_badge`,
      };
    },
    [t]
  );

  const buildActiveBadgeSvg = useCallback(async () => {
    const meta = getBadgeExportMeta(activeBadge);
    return buildBadgeSvg({
      appName: t('app.name'),
      badgeName: meta.badgeName,
      description: meta.description,
      statusLabel: meta.statusLabel,
      isEarned: meta.isEarned,
      iconName: activeBadge.icon,
      exportFooter: t('badgesPage.exportFooter'),
    });
  }, [activeBadge, getBadgeExportMeta, t]);

  const handleDownloadSvg = useCallback(async () => {
    if (!activeBadge || !canDownload) return;
    setIsExporting(true);
    try {
      const meta = getBadgeExportMeta(activeBadge);
      const svg = await buildActiveBadgeSvg();
      downloadSvgBadge(svg, `${meta.fileBase}.svg`);
    } finally {
      setIsExporting(false);
    }
  }, [activeBadge, buildActiveBadgeSvg, canDownload, getBadgeExportMeta]);

  const handleDownloadPng = useCallback(async () => {
    if (!activeBadge || !canDownload) return;
    setIsExporting(true);
    try {
      const meta = getBadgeExportMeta(activeBadge);
      const svg = await buildActiveBadgeSvg();
      await downloadPngBadge(svg, `${meta.fileBase}.png`);
    } finally {
      setIsExporting(false);
    }
  }, [activeBadge, buildActiveBadgeSvg, canDownload, getBadgeExportMeta]);

  const slideTransition = prefersReducedMotion
    ? { duration: 0.2 }
    : { type: 'spring', stiffness: 280, damping: 32, mass: 0.9 };

  if (!badges?.length || !activeBadge) return null;

  return (
    <div className="w-full">
      <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 px-4 leading-tight">
        {t('badgesPage.roadmapHint')}
      </h2>
      <p className="text-center text-sm md:text-base text-emerald-600 dark:text-emerald-400 font-semibold mb-10">
        {t('badgesPage.unlockedCount', { earned: earnedCount, total: totalCount })}
      </p>

      <div className="relative px-12 md:px-14">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
          aria-label={t('badgesPage.previousBadge')}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === badges.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
          aria-label={t('badgesPage.nextBadge')}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
        </button>

        <div
          ref={containerRef}
          className="overflow-hidden py-6 md:py-10 touch-pan-y"
        >
          <motion.div
            className="flex items-center cursor-grab active:cursor-grabbing"
            style={{ gap: SLIDE_GAP }}
            animate={{ x: trackOffset }}
            transition={slideTransition}
            onPanEnd={handlePanEnd}
          >
            {badges.map((badge, index) => {
              const isActive = index === activeIndex;
              const distance = Math.abs(index - activeIndex);

              return (
                <motion.button
                  key={badge.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className="flex-shrink-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-3xl"
                  style={{ width: slideWidth }}
                  animate={{
                    scale: isActive ? 1 : distance === 1 ? 0.78 : 0.65,
                    opacity: isActive ? 1 : distance === 1 ? 0.55 : 0.35,
                  }}
                  transition={slideTransition}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={t(`badges.${kebabToCamel(badge.id)}.name`)}
                >
                  <BadgeMilestone
                    badge={badge}
                    variant={isActive ? 'hero' : 'peek'}
                    isNextMilestone={index === nextMilestoneIndex && isActive}
                    isNewlyUnlocked={badge.id === newlyUnlockedId && isActive}
                    showCheckmark={checkmarkIds.has(badge.id)}
                  />
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {badges.map((badge, index) => (
          <button
            key={badge.id}
            type="button"
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-8 bg-emerald-500'
                : badge.status === BADGE_STATUS.EARNED
                  ? 'w-2 bg-emerald-300 dark:bg-emerald-700'
                  : 'w-2 bg-slate-300 dark:bg-slate-600'
            }`}
            aria-label={t(`badges.${kebabToCamel(badge.id)}.name`)}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t(`badges.${kebabToCamel(activeBadge.id)}.name`)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeBadge.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="glass-card p-6 max-w-lg mx-auto text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            {isActiveEarned ? t('badgesPage.exportHint') : t('badgesPage.exportLockedHint')}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
            <Button variant="secondary" onClick={handleDownloadPng} disabled={!canDownload}>
              <Image className="w-5 h-5" aria-hidden="true" />
              {t('badgesPage.downloadPng')}
            </Button>
            <Button variant="secondary" onClick={handleDownloadSvg} disabled={!canDownload}>
              <Download className="w-5 h-5" aria-hidden="true" />
              {t('badgesPage.downloadSvg')}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BadgeCarousel;
