import { Leaf, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE, ROUTES } from '../../constants/ui';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-emerald-400" aria-hidden="true" />
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm text-slate-400">{APP_TAGLINE}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to={ROUTES.CALCULATOR} className="hover:text-emerald-400 transition-colors">Calculator</Link></li>
              <li><Link to={ROUTES.TRACKER} className="hover:text-emerald-400 transition-colors">Tracker</Link></li>
              <li><Link to={ROUTES.DASHBOARD} className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><Link to={ROUTES.PLANNER} className="hover:text-emerald-400 transition-colors">Planner</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Our Mission</h3>
            <p className="text-sm text-slate-400">
              Empowering Indians to understand, track, and reduce their carbon footprint for a sustainable future.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400" aria-hidden="true" /> for Planet Earth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
