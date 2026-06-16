import { motion } from 'framer-motion';
import { getIcon } from '../../utils/icons';
import { formatNumber } from '../../utils/formatters';

const ImpactCard = ({ title, value, unit, icon, index = 0 }) => {
  const IconComponent = getIcon(icon);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-5 text-center hover:shadow-xl transition-all duration-300"
    >
      <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3">
        <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(value)}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{unit}</p>
      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">{title}</p>
    </motion.div>
  );
};

export default ImpactCard;
