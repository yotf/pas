/**
 * @module Internationalization
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './translations/en.json';
import ptTranslations from './translations/pt.json';
import deTranslations from './translations/de.json';

const resources = {
  en: enTranslations,
  pt: ptTranslations,
  de: deTranslations,
};

export const availableLanguages = Object.keys(resources);

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  resources,
  // ns: ['productionOrders', 'routings'],
});

export default i18n;
