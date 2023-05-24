/**
 * @module LocalizationService
 */
import { availableLanguages } from '@/localizations/i18n';

export const LANGUAGE_KEY = 'Language';
/** Sets language chosen for localization in the local storage */
export const setLang = (lang: string): void => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};
/** Gets currently selected localization language from the local storage (or defaults to english) */
export const getLang = (): string => {
  const lang = localStorage.getItem(LANGUAGE_KEY);
  if (!lang) {
    setLang(availableLanguages[0]);
  }
  return localStorage.getItem(LANGUAGE_KEY)!;
};
