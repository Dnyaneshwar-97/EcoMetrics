import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getIcon } from '../../utils/icons';
import { kebabToCamel } from '../../utils/i18nHelpers';
import { ENVIRONMENTAL_IMPACTS, CALCULATION_CATEGORIES, REDUCTION_TIPS } from '../../constants/tips';

const ImpactSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="py-16 md:py-24 page-section-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title mb-4">{t('impact.title')}</h2>
            <p className="section-subtitle mx-auto">{t('impact.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENVIRONMENTAL_IMPACTS.map((impact, index) => {
              const IconComponent = getIcon(impact.icon);
              const key = kebabToCamel(impact.id);
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
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {t(`environmentalImpacts.${key}.title`)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t(`environmentalImpacts.${key}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 page-section-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title mb-4">{t('impact.calculatedTitle')}</h2>
            <p className="section-subtitle mx-auto">{t('impact.calculatedSubtitle')}</p>
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
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {t(`calcCategories.${cat.id}.title`)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t(`calcCategories.${cat.id}.unit`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 page-section-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title mb-4">{t('impact.tipsTitle')}</h2>
            <p className="section-subtitle mx-auto">{t('impact.tipsSubtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REDUCTION_TIPS.map((tip, index) => {
              const IconComponent = getIcon(tip.icon);
              const key = kebabToCamel(tip.id);
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
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {t(`reductionTips.${key}.title`)}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t(`reductionTips.${key}.description`)}
                      </p>
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
};

export default ImpactSection;
