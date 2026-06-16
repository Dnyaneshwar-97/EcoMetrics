import { motion } from 'framer-motion';
import { getIcon } from '../../utils/icons';

const StatCard = ({ label, value, unit, icon, index = 0, className = '' }) => {
  const IconComponent = getIcon(icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card p-6 hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          {unit && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{unit}</p>}
        </div>
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
          <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
