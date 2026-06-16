import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS, ROUTES } from '../../constants/ui';
import AppLogo from '../ui/AppLogo';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <AppLogo size="sm" />
              <span className="text-xl font-bold text-white">{t('app.name')}</span>
            </div>
            <p className="text-sm text-slate-400">{t('app.tagline')}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.filter((item) => item.path !== ROUTES.HOME).map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-emerald-400 transition-colors">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.missionTitle')}</h3>
            <p className="text-sm text-slate-400">{t('footer.mission')}</p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} {t('app.name')}. {t('footer.copyright')}</p>
          <p className="flex items-center gap-1">
            {t('footer.madeWith')} <Heart className="w-4 h-4 text-red-400" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
