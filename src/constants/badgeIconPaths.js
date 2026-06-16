/** Lucide icon paths (24×24 viewBox) for badge export SVG/PNG */
export const BADGE_ICON_PATHS = {
  Sprout: [
    'M7 20h10',
    'M10 20c5.5-2.5.8-6.4 3-10',
    'M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8.4-1.3 0-2.7-.1-4.3-.4.5-1.5 1.2-2.9 2.3-3.7',
    'M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.6-4.6-2.7.7-4 2.1-4.6 3.8z',
  ],
  BookOpen: [
    'M12 7v14',
    'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
  ],
  Sword: [
    'M14.5 17.5 3 6V3h3l11.5 11.5',
    'M13 19l6-6',
    'M16 16l4 4',
    'M19 21v-4',
  ],
  Trophy: [
    'M6 9H4.5a2.5 2.5 0 0 1 0-5H6',
    'M18 9h1.5a2.5 2.5 0 0 0 0-5H18',
    'M4 22h16',
    'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22',
    'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22',
    'M18 2H6v7a6 6 0 0 0 12 0V2Z',
  ],
  Shield: [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  ],
};

export const renderBadgeIconPathsGroup = (iconName, color) => {
  const paths = BADGE_ICON_PATHS[iconName] ?? BADGE_ICON_PATHS.Sprout;
  return paths
    .map((d) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`)
    .join('\n      ');
};
