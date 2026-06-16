import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Download, Loader2 } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import TrendChart from '../components/charts/TrendChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import ProgressBarChart from '../components/charts/ProgressBarChart';
import ReductionAreaChart from '../components/charts/ReductionAreaChart';
import BadgeDisplay from '../components/ui/BadgeDisplay';
import Button from '../components/ui/Button';
import TipsCarousel from '../components/sections/TipsCarousel';
import { useCarbonData } from '../hooks/useLocalStorage';
import { evaluateBadges } from '../services/badgeService';
import { generateRecommendations } from '../services/recommendationService';
import { getMonthLabel } from '../utils/formatters';
import { calculateImprovement } from '../utils/calculations';
import { generatePdfReport, captureDashboardCharts, CHART_EXPORT_IDS } from '../utils/pdfExport';
import { ROUTES } from '../constants/ui';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
  const { calculations, latestCalculation, plan, loading } = useCarbonData();
  const [exporting, setExporting] = useState(false);

  const badges = useMemo(
    () => evaluateBadges(calculations, plan),
    [calculations, plan]
  );

  const trendData = useMemo(() => {
    return [...calculations]
      .reverse()
      .map((calc) => ({
        label: getMonthLabel(calc.date),
        footprint: calc.monthlyFootprintKg,
        score: calc.score,
      }));
  }, [calculations]);

  const scoreHistoryData = useMemo(() => {
    return [...calculations]
      .reverse()
      .map((calc) => ({
        label: getMonthLabel(calc.date),
        score: calc.score,
      }));
  }, [calculations]);

  const annualProgressData = useMemo(() => {
    const monthlyTotals = {};
    calculations.forEach((calc) => {
      const month = new Date(calc.date).getMonth();
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = [];
      }
      monthlyTotals[month].push(calc.annualFootprintKg);
    });

    return MONTH_NAMES.map((name, index) => ({
      label: name,
      value: monthlyTotals[index]
        ? Math.round(
            monthlyTotals[index].reduce((a, b) => a + b, 0) / monthlyTotals[index].length
          )
        : 0,
    }));
  }, [calculations]);

  const reductionData = useMemo(() => {
    const reversed = [...calculations].reverse();
    return reversed.map((calc, index) => {
      const prev = index > 0 ? reversed[index - 1] : null;
      const reduction = prev
        ? calculateImprovement(calc.annualFootprintKg, prev.annualFootprintKg)
        : 0;
      return {
        label: getMonthLabel(calc.date),
        reduction: Math.max(0, reduction),
      };
    });
  }, [calculations]);

  const handleExportPdf = useCallback(async () => {
    if (exporting) return;

    setExporting(true);
    try {
      const recommendations = latestCalculation
        ? generateRecommendations(latestCalculation)
        : [];
      const charts = await captureDashboardCharts();

      await generatePdfReport({
        calculation: latestCalculation,
        recommendations,
        plan,
        badges,
        charts,
      });
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setExporting(false);
    }
  }, [exporting, latestCalculation, plan, badges]);

  if (loading) {
    return (
      <PageWrapper className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">Loading...</div>
      </PageWrapper>
    );
  }

  if (calculations.length === 0) {
    return (
      <PageWrapper className="py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Data Available</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Complete a carbon footprint calculation to view your analytics dashboard.
          </p>
          <Link to={ROUTES.CALCULATOR}>
            <Button>Go to Calculator</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-emerald-600" aria-hidden="true" />
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Visualize your carbon footprint trends and progress.
            </p>
          </div>
          <Button variant="secondary" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-5 h-5" aria-hidden="true" />
            )}
            {exporting ? 'Exporting...' : 'Export PDF Report'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendChart
            data={trendData}
            dataKey="footprint"
            title="Monthly Footprint Trend"
            exportId={CHART_EXPORT_IDS.MONTHLY_TREND}
          />
          <CategoryPieChart
            data={latestCalculation?.categories}
            title="Category Contribution"
            exportId={CHART_EXPORT_IDS.CATEGORY_PIE}
          />
          <ProgressBarChart
            data={annualProgressData}
            dataKey="value"
            title="Annual Progress (kg CO₂/year)"
            exportId={CHART_EXPORT_IDS.ANNUAL_PROGRESS}
          />
          <ReductionAreaChart
            data={reductionData}
            dataKey="reduction"
            title="Reduction Trend (%)"
            exportId={CHART_EXPORT_IDS.REDUCTION_TREND}
          />
        </div>

        <div className="mb-8">
          <TrendChart
            data={scoreHistoryData}
            dataKey="score"
            color="#3b82f6"
            title="Carbon Score History"
            exportId={CHART_EXPORT_IDS.SCORE_HISTORY}
          />
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Badges</h2>
          <BadgeDisplay badges={badges} exportId={CHART_EXPORT_IDS.BADGES} />
        </section>

        <div className="max-w-2xl mx-auto">
          <TipsCarousel />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
