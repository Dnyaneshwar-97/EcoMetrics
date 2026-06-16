export const STORAGE_KEYS = {
  CALCULATIONS: 'ecometrics_calculations',
  PLANNER: 'ecometrics_planner',
  BADGES: 'ecometrics_badges',
  THEME: 'ecometrics_theme',
  LATEST_CALCULATION: 'ecometrics_latest_calculation',
};

export const ROUTES = {
  HOME: '/',
  CALCULATOR: '/calculator',
  TRACKER: '/tracker',
  DASHBOARD: '/dashboard',
  PLANNER: '/planner',
};

export const NAV_ITEMS = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.CALCULATOR, label: 'Calculator' },
  { path: ROUTES.TRACKER, label: 'Tracker' },
  { path: ROUTES.DASHBOARD, label: 'Dashboard' },
  { path: ROUTES.PLANNER, label: 'Planner' },
];

export const CHART_COLORS = {
  electricity: '#10b981',
  transportation: '#3b82f6',
  flights: '#8b5cf6',
  food: '#f59e0b',
  waste: '#ef4444',
};

export const CATEGORY_LABELS = {
  electricity: 'Electricity',
  transportation: 'Transportation',
  flights: 'Flights',
  food: 'Food',
  waste: 'Waste',
};

export const SCORE_COLORS = {
  Excellent: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500' },
  Good: { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-400', border: 'border-lime-500' },
  Moderate: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-500' },
  High: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-500' },
  Critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-500' },
};

export const PLANNER_TARGETS = [
  { value: 10, label: '10%' },
  { value: 20, label: '20%' },
  { value: 30, label: '30%' },
  { value: 50, label: '50%' },
  { value: 'custom', label: 'Custom' },
];

export const TIME_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const APP_NAME = 'EcoMetrics';
export const APP_TAGLINE = 'Carbon Footprint Awareness Platform for India';
