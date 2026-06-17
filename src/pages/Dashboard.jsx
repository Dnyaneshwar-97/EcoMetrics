import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Download, Loader2, Award, ChevronRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import TrendChart from '../components/charts/TrendChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import ProgressBarChart from '../components/charts/ProgressBarChart';
import ReductionAreaChart from '../components/charts/ReductionAreaChart';
import Button from '../components/ui/Button';
import TipsCarousel from '../components/sections/TipsCarousel';
import { useCarbonData } from '../hooks/useLocalStorage';
import { evaluateBadges, getEarnedBadgeCount } from '../services/badgeService';
import { generateRecommendations } from '../services/recommendationService';
import { getMonthLabel } from '../utils/formatters';
import { calculateImprovement } from '../utils/calculations';
import { generatePdfReport, captureDashboardCharts, CHART_EXPORT_IDS } from '../utils/pdfExport';
import { ROUTES } from '../constants/ui';

const MONTH_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { calculations, latestCalculation, plan, loading } = useCarbonData();
  const [exporting, setExporting] = useState(false);

  const monthNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(i18n.language, { month: 'short' });
    return MONTH_INDICES.map((index) => formatter.format(new Date(2024, index, 1)));
  }, [i18n.language]);

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

    return monthNames.map((name, index) => ({
      label: name,
      value: monthlyTotals[index]
        ? Math.round(
            monthlyTotals[index].reduce((a, b) => a + b, 0) / monthlyTotals[index].length
          )
        : 0,
    }));
  }, [calculations, monthNames]);

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
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">{t('common.loading')}</div>
      </PageWrapper>
    );
  }

  if (calculations.length === 0) {
    return (
      <PageWrapper className="py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.noDataTitle')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{t('dashboard.noDataDesc')}</p>
          <Button to={ROUTES.CALCULATOR}>{t('dashboard.goToCalculator')}</Button>
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
              {t('dashboard.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{t('dashboard.subtitle')}</p>
          </div>
          <Button variant="secondary" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-5 h-5" aria-hidden="true" />
            )}
            {exporting ? t('dashboard.exporting') : t('dashboard.export')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendChart
            data={trendData}
            dataKey="footprint"
            title={t('dashboard.charts.monthlyTrend')}
            exportId={CHART_EXPORT_IDS.MONTHLY_TREND}
          />
          <CategoryPieChart
            data={latestCalculation?.categories}
            title={t('dashboard.charts.categoryPie')}
            exportId={CHART_EXPORT_IDS.CATEGORY_PIE}
          />
          <ProgressBarChart
            data={annualProgressData}
            dataKey="value"
            title={t('dashboard.charts.annualProgress')}
            exportId={CHART_EXPORT_IDS.ANNUAL_PROGRESS}
          />
          <ReductionAreaChart
            data={reductionData}
            dataKey="reduction"
            title={t('dashboard.charts.reductionTrend')}
            exportId={CHART_EXPORT_IDS.REDUCTION_TREND}
          />
        </div>

        <div className="mb-8">
          <TrendChart
            data={scoreHistoryData}
            dataKey="score"
            color="#3b82f6"
            title={t('dashboard.charts.scoreHistory')}
            exportId={CHART_EXPORT_IDS.SCORE_HISTORY}
            valueLabel={t('scores.label')}
          />
        </div>

        <section className="mb-8">
          <Link
            to={ROUTES.BADGES}
            className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xl transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl group-hover:scale-105 transition-transform">
                <Award className="w-7 h-7 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {t('dashboard.badgesLinkTitle')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('dashboard.badgesLinkDesc', { earned: getEarnedBadgeCount(badges), total: badges.length })}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {t('dashboard.viewBadges')}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </span>
          </Link>
        </section>

        <div className="max-w-2xl mx-auto">
          <TipsCarousel />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
