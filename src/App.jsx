import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ROUTES } from './constants/ui';

const Home = lazy(() => import('./pages/Home'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Tracker = lazy(() => import('./pages/Tracker'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Planner = lazy(() => import('./pages/Planner'));

const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent" role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.CALCULATOR} element={<Calculator />} />
            <Route path={ROUTES.TRACKER} element={<Tracker />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PLANNER} element={<Planner />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
