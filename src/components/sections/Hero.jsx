import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, Target, ArrowRight, Leaf } from 'lucide-react';
import Button from '../ui/Button';
import { ROUTES } from '../../constants/ui';

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 py-20 md:py-32">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" aria-hidden="true" />
            Carbon Footprint Awareness for India
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Understand Your{' '}
            <span className="text-gradient">Carbon Footprint</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Calculate, track, and reduce your environmental impact with India-specific data.
            Join the movement towards a sustainable future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={ROUTES.CALCULATOR}>
              <Button size="lg">
                <Calculator className="w-5 h-5" aria-hidden="true" />
                Calculate My Carbon Footprint
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link to={ROUTES.PLANNER}>
              <Button variant="secondary" size="lg">
                <Target className="w-5 h-5" aria-hidden="true" />
                Start Reducing Today
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
