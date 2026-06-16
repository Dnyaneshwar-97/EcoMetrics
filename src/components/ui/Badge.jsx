import { useTranslation } from 'react-i18next';
import { SCORE_COLORS } from '../../constants/ui';

const Badge = ({ category, score, size = 'md', className = '' }) => {
  const { t } = useTranslation();
  const colors = SCORE_COLORS[category] ?? SCORE_COLORS.Moderate;
  const label = t(`scores.${category}`, { defaultValue: category });

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizes[size]} ${className}`}
      role="status"
      aria-label={`${label}${score !== undefined ? `, ${score}/100` : ''}`}
    >
      {score !== undefined && <span>{score}/100</span>}
      <span>{label}</span>
    </span>
  );
};

export default Badge;
