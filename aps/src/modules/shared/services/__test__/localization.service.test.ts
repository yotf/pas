import { availableLanguages } from '@/localizations/i18n';
import { getLang, LANGUAGE_KEY, setLang } from '../localization.service';

const language = availableLanguages[0];

afterEach(() => {
  localStorage.clear();
});

describe('Localization service', () => {
  it('set language', () => {
    setLang(language);
    expect(localStorage.getItem(LANGUAGE_KEY)).toBe(language);
  });

  it('get language', () => {
    localStorage.setItem(LANGUAGE_KEY, language);
    expect(getLang()).toBe(language);
  });

  it('set default language', () => {
    const getLanguage = getLang();
    expect(getLanguage).toBe(availableLanguages[0]);
  });
});
