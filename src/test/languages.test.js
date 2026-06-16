import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getLanguageByCode,
  getFontFamilyForLanguage,
} from '../i18n/languages';

describe('languages', () => {
  it('supports 13 languages', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(13);
  });

  it('falls back to default for unknown codes', () => {
    expect(getLanguageByCode('xx').code).toBe(DEFAULT_LANGUAGE);
  });

  it('marks Urdu as RTL', () => {
    expect(getLanguageByCode('ur').rtl).toBe(true);
  });

  it('returns a font family for Devanagari scripts', () => {
    expect(getFontFamilyForLanguage('hi')).toContain('Noto Sans Devanagari');
  });
});
