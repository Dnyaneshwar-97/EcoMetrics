import Hero from '../components/sections/Hero';
import EducationSection from '../components/sections/EducationSection';
import ImpactSection from '../components/sections/ImpactSection';
import StatCard from '../components/ui/StatCard';
import TipsCarousel from '../components/sections/TipsCarousel';
import PageWrapper from '../components/layout/PageWrapper';
import { SUSTAINABILITY_STATS } from '../constants/tips';

const Home = () => (
  <PageWrapper>
    <Hero />
    <EducationSection />
    <ImpactSection />

    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Sustainability Statistics</h2>
          <p className="section-subtitle mx-auto">
            Key facts about carbon emissions in India and globally.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUSTAINABILITY_STATS.map((stat, index) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              icon={stat.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <TipsCarousel />
      </div>
    </section>
  </PageWrapper>
);

export default Home;
