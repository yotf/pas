/**
 * @module useTranslate
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface TranslateResponse {
  translate: (value: string, options?: Record<string, string>) => string;
}

export type UseTranslateProps = {
  /** Localization Namespace */
  ns?: string;
  /** Nested localization inside of the ns namespace */
  keyPrefix?: string;
};
/** @returns Localized value for the entered string */
export const useTranslate = ({ ns, keyPrefix }: UseTranslateProps): TranslateResponse => {
  const options = useMemo(() => ({ keyPrefix }), [keyPrefix]);
  const { t } = useTranslation(ns, options);
  return {
    translate: t,
  };
};
