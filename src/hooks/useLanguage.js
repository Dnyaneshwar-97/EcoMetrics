import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFontFamilyForLanguage, getLanguageByCode } from '../i18n/languages';
import { changeAppLanguage } from '../i18n/config';

const applyDocumentLanguage = (code) => {
  const lang = getLanguageByCode(code);
  document.documentElement.lang = code;
  document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
  document.body.style.fontFamily = getFontFamilyForLanguage(code);
};

/**
 * Sync document lang, dir, and font family with active i18n language
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    applyDocumentLanguage(i18n.language);
    const handleLanguageChanged = (code) => applyDocumentLanguage(code);
    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [i18n]);

  return {
    language: i18n.language,
    changeLanguage: changeAppLanguage,
  };
};
