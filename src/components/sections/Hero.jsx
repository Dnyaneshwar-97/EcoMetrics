import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calculator, Target, ArrowRight, Leaf } from 'lucide-react';
import Button from '../ui/Button';
import { ROUTES, HERO_BACKGROUND_IMAGE } from '../../constants/ui';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-16 md:py-24 min-h-[85vh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BACKGROUND_IMAGE})` }}
        role="img"
        aria-label={t('hero.imageAlt')}
      />

      <div
        className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-emerald-900/25 to-emerald-950/70"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200/50 bg-slate-50/95 px-6 py-10 shadow-2xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/95 md:px-12 md:py-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-semibold mb-6 border border-emerald-200 dark:border-emerald-700">
              <Leaf className="w-4 h-4" aria-hidden="true" />
              {t('hero.badge')}
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {t('hero.title')}{' '}
              <span className="text-gradient">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ROUTES.CALCULATOR}>
                <Button size="lg">
                  <Calculator className="w-5 h-5" aria-hidden="true" />
                  {t('hero.ctaCalculate')}
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link to={ROUTES.PLANNER}>
                <Button variant="secondary" size="lg">
                  <Target className="w-5 h-5" aria-hidden="true" />
                  {t('hero.ctaReduce')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
