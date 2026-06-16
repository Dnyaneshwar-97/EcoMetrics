import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';
import { changeAppLanguage } from '../../i18n/config';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  const handleSelect = async (code) => {
    await changeAppLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300/80 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label={t('nav.selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span className="max-w-[5rem] truncate">{current.nativeName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t('nav.selectLanguage')}
          className="absolute end-0 mt-2 w-52 max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-xl z-50 py-1"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.code === i18n.language}>
              <button
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-start hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors ${
                  lang.code === i18n.language
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>
                  <span className="block font-medium">{lang.nativeName}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{lang.name}</span>
                </span>
                {lang.code === i18n.language && <Check className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
