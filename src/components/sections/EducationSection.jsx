import { motion } from 'framer-motion';
import { getIcon } from '../../utils/icons';
import { EDUCATION_CONTENT, EMISSION_SOURCES } from '../../constants/tips';

const EducationSection = () => (
  <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="section-title mb-4">{EDUCATION_CONTENT.title}</h2>
        <p className="section-subtitle mx-auto">{EDUCATION_CONTENT.description}</p>
        <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">{EDUCATION_CONTENT.whyItMatters}</p>
      </motion.div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
        Sources of Emissions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {EMISSION_SOURCES.map((source, index) => {
          const IconComponent = getIcon(source.icon);
          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl w-fit mb-4">
                <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{source.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{source.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default EducationSection;
