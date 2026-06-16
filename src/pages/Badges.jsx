import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Calculator } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import BadgeCarousel from '../components/badges/BadgeCarousel';
import Button from '../components/ui/Button';
import TipsCarousel from '../components/sections/TipsCarousel';
import { useCarbonData } from '../hooks/useLocalStorage';
import { evaluateBadges } from '../services/badgeService';
import { ROUTES } from '../constants/ui';

const Badges = () => {
  const { t } = useTranslation();
  const { calculations, plan, loading } = useCarbonData();

  const badges = useMemo(
    () => evaluateBadges(calculations, plan),
    [calculations, plan]
  );

  if (loading) {
    return (
      <PageWrapper className="py-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500">{t('common.loading')}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="section-title mb-4 flex items-center justify-center gap-3">
            <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            {t('badgesPage.title')}
          </h1>
          <p className="section-subtitle mx-auto">{t('badgesPage.subtitle')}</p>
        </div>

        {calculations.length === 0 ? (
          <div className="glass-card p-12 text-center max-w-xl mx-auto">
            <Award className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('badgesPage.emptyTitle')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t('badgesPage.emptyDesc')}</p>
            <Link to={ROUTES.CALCULATOR}>
              <Button>
                <Calculator className="w-5 h-5" aria-hidden="true" />
                {t('tracker.calculateNow')}
              </Button>
            </Link>
          </div>
        ) : (
          <BadgeCarousel badges={badges} />
        )}

        <div className="mt-12 max-w-2xl mx-auto">
          <TipsCarousel />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Badges;
