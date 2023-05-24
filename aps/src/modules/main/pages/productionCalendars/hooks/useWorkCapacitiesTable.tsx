/**
 * @module useWorkCapacitiesTable
 */

import { timeFormat, zeroHourPlaceholder } from '@/modules/shared/consts';
import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { DayOfWeek } from '@/modules/shared/utils/dayOfWeek.enum';
import { useAppSelector } from '@/store/hooks';
import dayjs from 'dayjs';
import { ReactNode, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { WorkCapacityMapped } from '../../settings/redux/workcenterCapacities/interfaces';
/**
 *
 * @returns Renders work capacities of the selected work center(s) in {@link ProductionCalendarsForm} component.
 */
export const useWorkCapacitiesTable = (): JSX.Element => {
  const { workCapacities } = useAppSelector((state) => state.productionCalendarsWorkCapacities);

  const columnsOrder: (keyof WorkCapacityMapped)[] = [
    'id',
    'dayOfWeek',
    'start',
    'break',
    'end',
    'minutes',
    'availableMinutes',
    'capacity',
    'efficiency',
  ];

  const { translate } = useTranslate({ ns: 'workCenters', keyPrefix: 'maintain' });

  const workCenterCapacitiesMapped = useMemo(() => {
    if (!workCapacities) return [];
    return workCapacities.map((obj): WorkCapacityMapped => {
      const minutes =
        dayjs(obj.end, timeFormat).diff(dayjs(obj.start, timeFormat), 'minute') - obj.break;
      const availableMinutes = minutes * (obj.efficiency / 100);
      const availableMinutesRounded = Math.round(availableMinutes);
      return {
        id: obj.id,
        dayOfWeek: obj.dayOfWeek,
        start: obj.start || '',
        break: obj.break,
        end: obj.end || '',
        minutes: minutes || 0,
        availableMinutes: availableMinutesRounded || 0,
        capacity: obj.capacity,
        efficiency: obj.efficiency,
        guid: uuid(),
      };
    });
  }, [workCapacities]);

  const customColumns: Partial<Record<keyof WorkCapacityMapped, (value: any) => ReactNode>> = {
    dayOfWeek: (value: number) => <span>{translate(String(DayOfWeek[value]))}</span>,
    start: (value: string) => <span>{value || zeroHourPlaceholder}</span>,
    end: (value: string) => <span>{value || zeroHourPlaceholder}</span>,
  };

  const table = useTable<WorkCapacityMapped>({
    dataSource: workCenterCapacitiesMapped,
    translateHeader: translate,
    customColumns: customColumns,
    useActions: false,
    renderDeleteButton: false,
    rowKey: 'guid',
    columnsOrder: columnsOrder,
    usePaging: false,
    preventSort: true,
  });

  return table;
};
