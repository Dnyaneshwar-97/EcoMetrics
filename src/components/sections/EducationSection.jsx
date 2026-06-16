import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getIcon } from '../../utils/icons';
import { EMISSION_SOURCES } from '../../constants/tips';

const EducationSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 page-section-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">{t('education.title')}</h2>
          <p className="section-subtitle mx-auto">{t('education.description')}</p>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">{t('education.whyItMatters')}</p>
        </motion.div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
          {t('education.sourcesTitle')}
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
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {t(`emissionSources.${source.id}.title`)}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t(`emissionSources.${source.id}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
