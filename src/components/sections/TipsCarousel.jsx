import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { SUSTAINABILITY_TIPS } from '../../constants/tips';

const TIP_ROTATION_INTERVAL_MS = 5000;

const TipsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SUSTAINABILITY_TIPS.length);
    }, TIP_ROTATION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + SUSTAINABILITY_TIPS.length) % SUSTAINABILITY_TIPS.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SUSTAINABILITY_TIPS.length);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Sustainability Tip</h3>
      </div>

      <div className="relative min-h-[60px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-slate-600 dark:text-slate-300 text-center flex-1 px-8"
          >
            {SUSTAINABILITY_TIPS[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Previous tip"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1">
          {SUSTAINABILITY_TIPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-emerald-500 w-4' : 'bg-slate-300 dark:bg-slate-600'
              }`}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={goToNext}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Next tip"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TipsCarousel;
