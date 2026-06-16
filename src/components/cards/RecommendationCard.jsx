import { motion } from 'framer-motion';
import { Leaf, IndianRupee, TreePine } from 'lucide-react';
import { formatCurrency, formatCo2 } from '../../utils/formatters';

const RecommendationCard = ({ recommendation, index = 0 }) => {
  const { title, description, co2ReductionKg, moneySaved, treesEquivalent, ruleTitle } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-5 hover:shadow-xl transition-all duration-300"
    >
      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
        {ruleTitle}
      </span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-1 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{description}</p>
      <div className="flex flex-wrap gap-3">
        {co2ReductionKg > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
            <Leaf className="w-3 h-3" aria-hidden="true" />
            {formatCo2(co2ReductionKg)}/mo saved
          </span>
        )}
        {moneySaved > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
            <IndianRupee className="w-3 h-3" aria-hidden="true" />
            {formatCurrency(moneySaved)}/yr
          </span>
        )}
        {treesEquivalent > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
            <TreePine className="w-3 h-3" aria-hidden="true" />
            {treesEquivalent} trees/yr
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
