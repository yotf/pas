/**
 * @module useStatisticsTable
 */

import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { availabilityStyling } from '@/modules/shared/utils/utils';
import { useAppSelector } from '@/store/hooks';
import { ReactNode } from 'react';
import { WorkCenterStatistics } from '../../settings/redux/statistics/interfaces';
import { getLang } from '@/modules/auth/services/auth.service';

export const useStatisticsTable = (): any => {
  const { data } = useAppSelector((state) => state.statistics);

  const { translate } = useTranslate({ ns: 'statistics' });

  const customColumns: Partial<Record<keyof WorkCenterStatistics, (value: any) => ReactNode>> = {
    availability: (value: number) => (
      <span className={`availability ${availabilityStyling(value)}`}>
        {value < 0 ? `(${Math.abs(value)})` : value.toLocaleString('en', { useGrouping: true })}
      </span>
    ),
  };

  const table = useTable({
    rowKey: 'workCenterId',
    dataSource: data.workCentersData,
    translateHeader: translate,
    useActions: false,
    usePaging: false,
    height: 400,
    customColumns: customColumns,
  });

  return table;
};
