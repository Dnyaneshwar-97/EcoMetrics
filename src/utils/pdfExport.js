import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate, formatCo2, formatCurrency, formatNumber } from './formatters';
import { APP_NAME } from '../constants/ui';

const PAGE_MARGIN = 20;
const LINE_HEIGHT = 8;
const CHART_CAPTURE_DELAY_MS = 400;
const CHART_CAPTURE_SCALE = 2;

export const CHART_EXPORT_IDS = {
  MONTHLY_TREND: 'export-chart-monthly-trend',
  CATEGORY_PIE: 'export-chart-category-pie',
  ANNUAL_PROGRESS: 'export-chart-annual-progress',
  REDUCTION_TREND: 'export-chart-reduction-trend',
  SCORE_HISTORY: 'export-chart-score-history',
};

export const DASHBOARD_CHART_EXPORTS = [
  { id: CHART_EXPORT_IDS.MONTHLY_TREND, title: 'Monthly Footprint Trend' },
  { id: CHART_EXPORT_IDS.CATEGORY_PIE, title: 'Category Contribution' },
  { id: CHART_EXPORT_IDS.ANNUAL_PROGRESS, title: 'Annual Progress (kg CO₂/year)' },
  { id: CHART_EXPORT_IDS.REDUCTION_TREND, title: 'Reduction Trend (%)' },
  { id: CHART_EXPORT_IDS.SCORE_HISTORY, title: 'Carbon Score History' },
];

const addSectionTitle = (doc, title, y) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(title, PAGE_MARGIN, y);
  return y + LINE_HEIGHT + 4;
};

const addText = (doc, text, y, options = {}) => {
  doc.setFontSize(options.fontSize ?? 10);
  doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(text, PAGE_MARGIN, y);
  return y + (options.lineHeight ?? LINE_HEIGHT);
};

const getContentWidth = (doc) => doc.internal.pageSize.getWidth() - PAGE_MARGIN * 2;

const getPageHeight = (doc) => doc.internal.pageSize.getHeight();

const ensureSpace = (doc, y, requiredHeight) => {
  if (y + requiredHeight > getPageHeight(doc) - PAGE_MARGIN) {
    doc.addPage();
    return PAGE_MARGIN;
  }
  return y;
};

/**
 * Capture a DOM element as a PNG image for PDF embedding
 */
export const captureElementAsImage = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return null;

  element.scrollIntoView({ block: 'center', behavior: 'auto' });
  await new Promise((resolve) => setTimeout(resolve, CHART_CAPTURE_DELAY_MS));

  const canvas = await html2canvas(element, {
    scale: CHART_CAPTURE_SCALE,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        clonedElement.style.background = '#ffffff';
      }
    },
  });

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: canvas.width,
    height: canvas.height,
  };
};

/**
 * Capture all dashboard chart elements
 */
export const captureDashboardCharts = async (chartExports = DASHBOARD_CHART_EXPORTS) => {
  const captures = [];

  for (const chart of chartExports) {
    const image = await captureElementAsImage(chart.id);
    if (image) {
      captures.push({ title: chart.title, image });
    }
  }

  return captures;
};

const addChartImage = (doc, title, image, y) => {
  const contentWidth = getContentWidth(doc);
  const imgHeight = (image.height / image.width) * contentWidth;
  const titleHeight = LINE_HEIGHT + 8;
  const blockHeight = titleHeight + imgHeight + 10;

  y = ensureSpace(doc, y, blockHeight);
  y = addSectionTitle(doc, title, y);

  y = ensureSpace(doc, y, imgHeight + 10);
  doc.addImage(image.dataUrl, 'PNG', PAGE_MARGIN, y, contentWidth, imgHeight);

  return y + imgHeight + 10;
};

/**
 * Generate PDF report from calculation, charts, and related data
 */
export const generatePdfReport = async ({
  calculation,
  recommendations,
  plan,
  badges,
  charts = [],
}) => {
  const doc = new jsPDF();
  let y = PAGE_MARGIN;

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(APP_NAME, PAGE_MARGIN, y);
  y += 12;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Carbon Footprint Report', PAGE_MARGIN, y);
  y += 10;

  doc.setFontSize(9);
  doc.text(`Generated: ${formatDate(new Date().toISOString())}`, PAGE_MARGIN, y);
  y += 15;

  if (calculation) {
    y = addSectionTitle(doc, 'Carbon Footprint Summary', y);
    y = addText(doc, `Monthly Footprint: ${formatCo2(calculation.monthlyFootprintKg)}`, y);
    y = addText(doc, `Annual Footprint: ${formatCo2(calculation.annualFootprintKg, 'tonnes')}`, y);
    y = addText(doc, `Carbon Score: ${calculation.score}/100 (${calculation.scoreCategory})`, y);
    y += 5;

    y = addSectionTitle(doc, 'Category Breakdown', y);
    Object.entries(calculation.categories ?? {}).forEach(([key, value]) => {
      y = addText(doc, `${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatNumber(value, 1)} kg CO₂/month`, y);
    });
    y += 5;

    y = addSectionTitle(doc, 'Environmental Impact', y);
    const impact = calculation.environmentalImpact ?? {};
    y = addText(doc, `Trees Required: ${impact.treesRequired ?? 0} trees/year`, y);
    y = addText(doc, `Equivalent km Driven: ${formatNumber(impact.kmDriven ?? 0)} km`, y);
    y = addText(doc, `Coal Burned: ${impact.coalBurned ?? 0} kg`, y);
    y = addText(doc, `Smartphone Charges: ${formatNumber(impact.smartphoneCharges ?? 0)}`, y);
    y += 5;
  }

  if (charts.length > 0) {
    doc.addPage();
    y = PAGE_MARGIN;
    y = addSectionTitle(doc, 'Analytics & Visualizations', y);
    y += 4;

    charts.forEach((chart) => {
      y = addChartImage(doc, chart.title, chart.image, y);
    });
  }

  if (recommendations?.length) {
    y = ensureSpace(doc, y, 40);
    if (y === PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    } else if (y > 240) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
    y = addSectionTitle(doc, 'Recommendations', y);
    recommendations.slice(0, 5).forEach((rec) => {
      y = ensureSpace(doc, y, 24);
      y = addText(doc, `• ${rec.title}`, y, { bold: true });
      y = addText(doc, `  ${rec.description}`, y);
      y = addText(
        doc,
        `  Savings: ${formatCo2(rec.co2ReductionKg)}/month, ${formatCurrency(rec.moneySaved)}/year`,
        y
      );
      y += 2;
    });
    y += 5;
  }

  if (plan) {
    y = ensureSpace(doc, y, 40);
    if (y > 240) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
    y = addSectionTitle(doc, 'Reduction Plan', y);
    y = addText(doc, `Target Reduction: ${plan.targetPercent}%`, y);
    y = addText(doc, `Expected Reduction: ${formatCo2(plan.expectedReductionKg)}`, y);
    y = addText(doc, `Trees Saved: ${plan.treesSaved}`, y);
    y += 3;

    plan.tasks?.forEach((task) => {
      y = ensureSpace(doc, y, LINE_HEIGHT);
      const status = task.completed ? '[Done]' : '[ ]';
      y = addText(doc, `${status} Week ${task.week}: ${task.task}`, y);
    });
    y += 5;
  }

  if (badges?.length) {
    y = ensureSpace(doc, y, 30);
    if (y > 250) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
    y = addSectionTitle(doc, 'Earned Badges', y);
    const earned = badges.filter((b) => b.status === 'earned');
    if (earned.length === 0) {
      y = addText(doc, 'No badges earned yet. Keep reducing your footprint!', y);
    } else {
      earned.forEach((badge) => {
        y = ensureSpace(doc, y, LINE_HEIGHT);
        y = addText(doc, `${badge.name}: ${badge.description}`, y);
      });
    }
  }

  doc.save(`${APP_NAME.toLowerCase()}-report-${Date.now()}.pdf`);
};
