import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFontFamilyForLanguage } from '../i18n/languages';
import { changeAppLanguage } from '../i18n/config';

/**
 * Sync document lang, dir, and font family with active i18n language
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const applyLanguageSettings = (code) => {
      document.documentElement.lang = code;
      document.body.style.fontFamily = getFontFamilyForLanguage(code);
    };

    applyLanguageSettings(i18n.language);
    i18n.on('languageChanged', applyLanguageSettings);
    return () => i18n.off('languageChanged', applyLanguageSettings);
  }, [i18n]);

  return {
    language: i18n.language,
    changeLanguage: changeAppLanguage,
  };
};
