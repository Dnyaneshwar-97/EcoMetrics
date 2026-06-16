/** Supported Indian & regional languages for EcoMetrics */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'devanagari' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'devanagari' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'gujarati' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'bengali' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'tamil' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'telugu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'malayalam' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'gurmukhi' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'odia' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'bengali' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'arabic', rtl: true },
];

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGE_STORAGE_KEY = 'ecometrics_language';

export const getLanguageByCode = (code) =>
  SUPPORTED_LANGUAGES.find((lang) => lang.code === code) ?? SUPPORTED_LANGUAGES[0];

export const getFontFamilyForLanguage = (code) => {
  const lang = getLanguageByCode(code);
  switch (lang.script) {
    case 'devanagari':
      return "'Noto Sans Devanagari', 'Inter', system-ui, sans-serif";
    case 'gujarati':
      return "'Noto Sans Gujarati', 'Inter', system-ui, sans-serif";
    case 'bengali':
      return "'Noto Sans Bengali', 'Inter', system-ui, sans-serif";
    case 'tamil':
      return "'Noto Sans Tamil', 'Inter', system-ui, sans-serif";
    case 'telugu':
      return "'Noto Sans Telugu', 'Inter', system-ui, sans-serif";
    case 'kannada':
      return "'Noto Sans Kannada', 'Inter', system-ui, sans-serif";
    case 'malayalam':
      return "'Noto Sans Malayalam', 'Inter', system-ui, sans-serif";
    case 'gurmukhi':
      return "'Noto Sans Gurmukhi', 'Inter', system-ui, sans-serif";
    case 'odia':
      return "'Noto Sans Oriya', 'Inter', system-ui, sans-serif";
    case 'arabic':
      return "'Noto Naskh Arabic', 'Inter', system-ui, sans-serif";
    default:
      return "'Inter', system-ui, sans-serif";
  }
};
