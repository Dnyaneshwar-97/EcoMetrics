import { motion } from 'framer-motion';
import { getIcon } from '../../utils/icons';
import { ENVIRONMENTAL_IMPACTS, CALCULATION_CATEGORIES, REDUCTION_TIPS } from '../../constants/tips';

const ImpactSection = () => (
  <>
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">Environmental Impact</h2>
          <p className="section-subtitle mx-auto">
            Carbon emissions affect our planet in many ways. Understanding these impacts motivates change.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENVIRONMENTAL_IMPACTS.map((impact, index) => {
            const IconComponent = getIcon(impact.icon);
            return (
              <motion.div
                key={impact.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{impact.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{impact.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">How Carbon Footprint is Calculated</h2>
          <p className="section-subtitle mx-auto">
            We analyze five key lifestyle categories to estimate your personal emissions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CALCULATION_CATEGORIES.map((cat, index) => {
            const IconComponent = getIcon(cat.icon);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-5 text-center hover:shadow-xl transition-all"
              >
                <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3">
                  <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{cat.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{cat.unit}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">Reduction Tips</h2>
          <p className="section-subtitle mx-auto">
            Small changes in daily habits can make a significant difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REDUCTION_TIPS.map((tip, index) => {
            const IconComponent = getIcon(tip.icon);
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-lime-100 dark:bg-lime-900/30 rounded-xl flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-lime-600 dark:text-lime-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{tip.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  </>
);

export default ImpactSection;
