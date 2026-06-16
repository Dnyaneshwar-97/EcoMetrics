import { useState, useEffect, useMemo } from 'react';
import { BADGE_STATUS } from '../constants/badges';

const SEEN_EARNED_KEY = 'ecometrics_seen_earned_badges';
const CHECKMARKS_SHOWN_KEY = 'ecometrics_badge_checkmarks_shown';

const readStoredIds = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredIds = (key, ids) => {
  localStorage.setItem(key, JSON.stringify(ids));
};

/**
 * Tracks badge journey state: next milestone, unlock animations, checkmark reveals.
 */
export const useBadgeJourney = (badges) => {
  const [newlyUnlockedId, setNewlyUnlockedId] = useState(null);
  const [checkmarkIds, setCheckmarkIds] = useState(new Set());

  const earnedIds = useMemo(
    () => badges.filter((b) => b.status === BADGE_STATUS.EARNED).map((b) => b.id),
    [badges]
  );

  const earnedCount = earnedIds.length;
  const totalCount = badges.length;

  const nextMilestoneIndex = useMemo(
    () => badges.findIndex((b) => b.status === BADGE_STATUS.LOCKED),
    [badges]
  );

  useEffect(() => {
    if (earnedIds.length === 0) {
      writeStoredIds(SEEN_EARNED_KEY, []);
      return undefined;
    }

    const previouslySeen = readStoredIds(SEEN_EARNED_KEY);
    const freshUnlocks = earnedIds.filter((id) => !previouslySeen.includes(id));

    if (freshUnlocks.length > 0) {
      setNewlyUnlockedId(freshUnlocks[freshUnlocks.length - 1]);
      const timer = setTimeout(() => {
        writeStoredIds(SEEN_EARNED_KEY, earnedIds);
        setNewlyUnlockedId(null);
      }, 2400);
      return () => clearTimeout(timer);
    }

    writeStoredIds(SEEN_EARNED_KEY, earnedIds);
    return undefined;
  }, [earnedIds]);

  useEffect(() => {
    if (earnedIds.length === 0) return undefined;

    const shown = readStoredIds(CHECKMARKS_SHOWN_KEY);
    const pendingCheckmarks = earnedIds.filter((id) => !shown.includes(id));

    if (pendingCheckmarks.length === 0) return undefined;

    setCheckmarkIds(new Set(pendingCheckmarks));
    const timer = setTimeout(() => {
      writeStoredIds(CHECKMARKS_SHOWN_KEY, earnedIds);
      setCheckmarkIds(new Set());
    }, 1800);

    return () => clearTimeout(timer);
  }, [earnedIds]);

  return {
    earnedCount,
    totalCount,
    nextMilestoneIndex,
    newlyUnlockedId,
    checkmarkIds,
  };
};
