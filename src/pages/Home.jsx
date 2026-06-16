import { useTranslation } from 'react-i18next';
import Hero from '../components/sections/Hero';
import EducationSection from '../components/sections/EducationSection';
import ImpactSection from '../components/sections/ImpactSection';
import StatCard from '../components/ui/StatCard';
import TipsCarousel from '../components/sections/TipsCarousel';
import PageWrapper from '../components/layout/PageWrapper';
import { SUSTAINABILITY_STATS } from '../constants/tips';
import { kebabToCamel } from '../utils/i18nHelpers';

const Home = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <Hero />
      <EducationSection />
      <ImpactSection />

      <section className="py-16 md:py-24 page-section-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">{t('stats.sectionTitle')}</h2>
            <p className="section-subtitle mx-auto">{t('stats.sectionSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUSTAINABILITY_STATS.map((stat, index) => {
              const key = kebabToCamel(stat.id);
              return (
                <StatCard
                  key={stat.id}
                  label={t(`stats.${key}.label`)}
                  value={key === 'topContributor' ? t(`stats.${key}.value`) : stat.value}
                  unit={t(`stats.${key}.unit`)}
                  icon={stat.icon}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 page-section-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <TipsCarousel />
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
