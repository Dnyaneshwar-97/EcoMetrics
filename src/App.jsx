import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { useLanguage } from './hooks/useLanguage';
import { ROUTES } from './constants/ui';

const Home = lazy(() => import('./pages/Home'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Tracker = lazy(() => import('./pages/Tracker'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Planner = lazy(() => import('./pages/Planner'));
const Badges = lazy(() => import('./pages/Badges'));

const LoadingFallback = () => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div
        className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"
        role="status"
        aria-label={t('common.loading')}
      >
        <span className="sr-only">{t('common.loading')}</span>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  useLanguage();
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-emerald-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {t('common.skipToContent')}
      </a>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.CALCULATOR} element={<Calculator />} />
              <Route path={ROUTES.TRACKER} element={<Tracker />} />
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.PLANNER} element={<Planner />} />
              <Route path={ROUTES.BADGES} element={<Badges />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <ThemeProvider>
    <AppRoutes />
  </ThemeProvider>
);

export default App;
