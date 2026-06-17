import { STORAGE_KEYS } from '../constants/ui';

/**
 * Safe localStorage wrapper with error handling
 */
const storageService = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  getCalculations() {
    return this.get(STORAGE_KEYS.CALCULATIONS) ?? [];
  },

  saveCalculation(calculation) {
    const calculations = this.getCalculations();
    calculations.unshift(calculation);
    this.set(STORAGE_KEYS.CALCULATIONS, calculations);
    this.set(STORAGE_KEYS.LATEST_CALCULATION, calculation);
    return calculation;
  },

  deleteCalculation(id) {
    const calculations = this.getCalculations().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.CALCULATIONS, calculations);
    return calculations;
  },

  getLatestCalculation() {
    return this.get(STORAGE_KEYS.LATEST_CALCULATION);
  },

  getPlanner() {
    return this.get(STORAGE_KEYS.PLANNER);
  },

  savePlanner(plan) {
    if (plan === null) {
      this.remove(STORAGE_KEYS.PLANNER);
      return null;
    }
    this.set(STORAGE_KEYS.PLANNER, plan);
    return plan;
  },

  getTheme() {
    return this.get(STORAGE_KEYS.THEME) ?? 'light';
  },

  saveTheme(theme) {
    this.set(STORAGE_KEYS.THEME, theme);
    return theme;
  },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach((key) => this.remove(key));
  },
};

export default storageService;
