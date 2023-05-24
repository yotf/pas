import '@/localizations/i18n';
import { availableLanguages, setLanguage } from '@/localizations/i18n';
import { LANGUAGE_KEY } from '@/modules/shared/services/localization.service';
import { render, screen } from '@testing-library/react';
import { t } from 'i18next';
import fs from 'fs';

const defaultLanguage = 'en';

test('Check translate', () => {
  setLanguage('en');
  const spanId = 'span_id';
  render(
    <span data-testid={spanId}>
      <>{t('unit_test')}</>
    </span>,
  );
  expect(screen.getByTestId(spanId).textContent).toContain('unit_test_en');
});

test('Validate localStorage', () => {
  setLanguage(defaultLanguage);
  const lang = localStorage.getItem(LANGUAGE_KEY);
  expect(defaultLanguage).toBe(lang);
});

test('All languages are included', () => {
  const length = fs.readdirSync('src/localizations/translations').length;
  expect(length).toBe(availableLanguages.length);
});
