import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  getFontFamilyForLanguage,
  getLanguageByCode,
} from './languages';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import as from './locales/as.json';
import ur from './locales/ur.json';

const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
};

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  gu: { translation: gu },
  bn: { translation: bn },
  ta: { translation: ta },
  te: { translation: te },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: as },
  ur: { translation: ur },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

const storedLang = getStoredLanguage();

const applyDocumentLanguage = (code) => {
  const lang = getLanguageByCode(code);
  document.documentElement.lang = code;
  document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
  document.body.style.fontFamily = getFontFamilyForLanguage(code);
};

export const changeAppLanguage = (code) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  applyDocumentLanguage(code);
  return i18n.changeLanguage(code);
};

applyDocumentLanguage(storedLang);

export default i18n;
