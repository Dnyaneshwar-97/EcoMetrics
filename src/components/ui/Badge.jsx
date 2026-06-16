import { SCORE_COLORS } from '../../constants/ui';

const Badge = ({ category, score, size = 'md', className = '' }) => {
  const colors = SCORE_COLORS[category] ?? SCORE_COLORS.Moderate;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizes[size]} ${className}`}
      role="status"
      aria-label={`Carbon score category: ${category}${score !== undefined ? `, score ${score}` : ''}`}
    >
      {score !== undefined && <span>{score}/100</span>}
      <span>{category}</span>
    </span>
  );
};

export default Badge;
