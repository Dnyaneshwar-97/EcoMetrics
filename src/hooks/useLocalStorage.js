import { useState, useEffect, useCallback } from 'react';
import storageService from '../services/storageService';

/**
 * Hook for persisting state in localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storageService.get(key);
      return item ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageService.set(key, valueToStore);
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * Hook for carbon calculation data from storage
 */
export const useCarbonData = () => {
  const [calculations, setCalculations] = useState([]);
  const [latestCalculation, setLatestCalculation] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setCalculations(storageService.getCalculations());
    setLatestCalculation(storageService.getLatestCalculation());
    setPlan(storageService.getPlanner());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveCalculation = useCallback(
    (calculation) => {
      storageService.saveCalculation(calculation);
      refresh();
    },
    [refresh]
  );

  const deleteCalculation = useCallback(
    (id) => {
      storageService.deleteCalculation(id);
      refresh();
    },
    [refresh]
  );

  const savePlan = useCallback(
    (newPlan) => {
      storageService.savePlanner(newPlan);
      refresh();
    },
    [refresh]
  );

  return {
    calculations,
    latestCalculation,
    plan,
    loading,
    saveCalculation,
    deleteCalculation,
    savePlan,
    refresh,
  };
};
