/**
 * @module Internationalization
 */

import { setLang } from '@/modules/shared/services/localization.service';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './translations/de.json';
import en from './translations/en.json';

const resources = {
  en,
  de,
};

export const availableLanguages = Object.keys(resources);

export const setLanguage = (lang: string): void => {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: lang,
    interpolation: {
      escapeValue: false,
    },
  });
  setLang(lang);
};
