import { APP_LOGO } from '../constants/ui';
import { renderBadgeIconPathsGroup } from '../constants/badgeIconPaths';

export const BADGE_EXPORT_WIDTH = 600;
export const BADGE_EXPORT_HEIGHT = 760;
export const BADGE_EXPORT_SCALE = 2;

const MAX_DESC_LINE_LENGTH = 42;

export const escapeXml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const wrapTextLines = (text, maxLength = MAX_DESC_LINE_LENGTH) => {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  });

  if (current) lines.push(current);
  return lines.slice(0, 4);
};

export const loadImageAsDataUrl = async (src) => {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Failed to load image: ${src}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Build a standalone SVG badge card for download (with embedded logo + icon).
 */
export const buildBadgeSvg = async ({
  appName,
  badgeName,
  description,
  statusLabel,
  isEarned,
  iconName,
  exportFooter,
}) => {
  const logoDataUrl = await loadImageAsDataUrl(APP_LOGO);
  const bg = isEarned ? '#ecfdf5' : '#f8fafc';
  const accent = isEarned ? '#059669' : '#64748b';
  const border = isEarned ? '#34d399' : '#cbd5e1';
  const statusBg = isEarned ? '#d1fae5' : '#e2e8f0';
  const descLines = wrapTextLines(description);
  const iconPaths = renderBadgeIconPathsGroup(iconName, accent);

  const descStartY = 396;
  const descLineHeight = 28;
  const statusPillY = 502;

  const descSvg = descLines
    .map(
      (line, index) =>
        `<text x="300" y="${descStartY + index * descLineHeight}" text-anchor="middle" fill="#475569" font-size="20" font-family="Inter, system-ui, sans-serif">${escapeXml(line)}</text>`
    )
    .join('\n    ');

  const statusY = statusPillY + 24;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${BADGE_EXPORT_WIDTH}" height="${BADGE_EXPORT_HEIGHT}" viewBox="0 0 ${BADGE_EXPORT_WIDTH} ${BADGE_EXPORT_HEIGHT}">
  <defs>
    <linearGradient id="badgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="${BADGE_EXPORT_WIDTH}" height="${BADGE_EXPORT_HEIGHT}" rx="32" fill="url(#badgeBg)" />
  <rect x="24" y="24" width="552" height="712" rx="24" fill="none" stroke="${border}" stroke-width="3" />
  <image href="${logoDataUrl}" x="264" y="36" width="72" height="72" preserveAspectRatio="xMidYMid meet" />
  <text x="300" y="132" text-anchor="middle" fill="${accent}" font-size="18" font-weight="600" font-family="Inter, system-ui, sans-serif" letter-spacing="2">${escapeXml(appName.toUpperCase())}</text>
  <circle cx="300" cy="230" r="72" fill="${statusBg}" stroke="${border}" stroke-width="3" ${isEarned ? 'filter="url(#glow)"' : ''} />
  <g transform="translate(300, 230) scale(2.75) translate(-12, -12)">
    ${iconPaths}
  </g>
  <text x="300" y="340" text-anchor="middle" fill="#0f172a" font-size="32" font-weight="700" font-family="Inter, system-ui, sans-serif">${escapeXml(badgeName)}</text>
  ${descSvg}
  <rect x="175" y="${statusPillY}" width="250" height="48" rx="24" fill="${statusBg}" />
  <text x="300" y="${statusY}" text-anchor="middle" dominant-baseline="middle" fill="${accent}" font-size="18" font-weight="600" font-family="Inter, system-ui, sans-serif">${escapeXml(statusLabel)}</text>
  <text x="300" y="620" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Inter, system-ui, sans-serif">${escapeXml(`${appName} — ${exportFooter}`)}</text>
</svg>`;
};

export const svgToPngDataUrl = async (svgString) => {
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to render badge SVG for PNG export'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = BADGE_EXPORT_WIDTH * BADGE_EXPORT_SCALE;
    canvas.height = BADGE_EXPORT_HEIGHT * BADGE_EXPORT_SCALE;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas unavailable');
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
};

export const triggerDownload = (href, filename) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadSvgBadge = (svgString, fileName) => {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, fileName);
  URL.revokeObjectURL(url);
};

export const downloadPngBadge = async (svgString, fileName) => {
  const dataUrl = await svgToPngDataUrl(svgString);
  triggerDownload(dataUrl, fileName);
};

export const slugifyBadgeFileName = (badgeId) =>
  badgeId.replace(/-/g, '_');
