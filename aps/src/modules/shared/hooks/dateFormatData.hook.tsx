/**
 * @module useDateFormat
 */

import { SettingsPageItem } from '@/modules/main/pages/settings/consts/interfaces';
import { useMemo } from 'react';
import { dateFormatter } from '../utils/utils';
/** Formats values of holiday dates which are shown in {@link HolidaysPage} */
export const useDateFormat = (data: SettingsPageItem[]): SettingsPageItem[] => {
  const formatedData = useMemo(
    () =>
      data.map((obj: SettingsPageItem) => {
        return { ...obj, holidayDate: dateFormatter(obj.holidayDate!) };
      }),
    [data],
  );

  return formatedData;
};
