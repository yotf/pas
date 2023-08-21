/**
 * @module ProductionCalendarsChecking
 */

import { timeFormat, zeroHourPlaceholder } from '@/modules/shared/consts';
import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter } from '@/modules/shared/utils/utils';
import { Tabs } from 'antd';
import dayjs from 'dayjs';
import { FC, ReactNode, useContext, useMemo, useState } from 'react';
import { MaintainContext } from '../../components/maintain/contexts/maintain.context';
import {
  ProductionCalendarDay,
  ProductionCalendarDayMapped,
} from '../settings/redux/productionCalendarsWorkCapacities/interfaces';
import { ProductionCalendarInputs } from './components/productionCalendarInputs/productionCalendar-inputs';
import './productionCalendar-form.scss';
import ProductionCalendarDayModal from './productionCalendarDay/productionCalendarDay-modal';

export type ProductionCalendarsCheckingProps = {
  checking: boolean;
  ns: string;
  exportToExcel: () => void;
  columnsOrder: (keyof ProductionCalendarDayMapped)[];
};
/**
 *
 * @param checking Defines if {@link ProductionCalendarInputs} are editable
 * @param ns Localization Namespace
 * @param exportToExcel Export to excel function
 * @param columnOrder Order of columns in the table
 * @returns Production Calendar Checking page with production calendar days and {@link ProductionCalendarDayModal} used for editing them
 */
const ProductionCalendarsChecking: FC<ProductionCalendarsCheckingProps> = ({
  checking,
  ns,
  exportToExcel,
  columnsOrder,
}: ProductionCalendarsCheckingProps) => {
  const {
    state: { entity },
  } = useContext(MaintainContext);
  const [activeTableKey, setActiveTableKey] = useState<number>(0);

  const tabsArray: [string, ProductionCalendarDay[]][] = useMemo(
    () => Object.entries(entity?.[0]?.productionCalendars || {}),
    [entity?.[0]?.productionCalendars],
  );

  const activeTableData = useMemo(() => {
    if (!entity) return [];
    if (!activeTableKey) return tabsArray[0][1].flat();
    const months = tabsArray.map((calendar) => calendar[1]);
    const activeData = months.filter((month, i) => {
      if (month.some((day) => day.id === Number(activeTableKey))) {
        return tabsArray[i];
      }
    });
    return activeData.flat();
  }, [activeTableKey, entity, tabsArray]);

  const { translate } = useTranslate({ ns: 'productionCalendar' });

  const translateMonths = (month: string): string => {
    const monthAndYear = month.split(' ');
    const localizedMonth = translate(monthAndYear[0]) + ' ' + monthAndYear[1];
    return localizedMonth;
  };

  const [selectedPCDay, setSelectedPCDay] = useState<ProductionCalendarDayMapped | undefined>();

  const onClose = (): void => {
    setSelectedPCDay(undefined);
  };
  const onEdit = (modalData: ProductionCalendarDayMapped): void => {
    setSelectedPCDay(modalData);
  };

  const { translate: translateTable } = useTranslate({ ns: 'workCenters', keyPrefix: 'maintain' });

  const productionCalendarDaysMapped = useMemo(() => {
    if (!activeTableData) return [];
    return activeTableData.map((obj): ProductionCalendarDayMapped => {
      const minutes =
        dayjs(obj.end, timeFormat).diff(dayjs(obj.start, timeFormat), 'minute') - obj.break;
      // const availableMinutes = minutes * (obj.efficiency / 100);
      // const availableMinutesRounded = Math.round(availableMinutes);
      return {
        id: obj.id,
        date: obj.weekDay,
        start: obj.start || '',
        break: obj.break,
        end: obj.end || '',
        minutes: minutes || 0,
        availableMinutes: obj.availableMinutes || 0,
        efficiency: obj.efficiency,
        remark: obj.remark,
        capacity: obj.capacity,
        isWorkingDay: obj.isWorkingDay,
        dayOfWeek: obj.dayOfWeek,
      };
    });
  }, [activeTableData]);

  const customColumns: Partial<
    Record<keyof ProductionCalendarDayMapped, (value: any) => ReactNode>
  > = {
    date: (value: string) => <span>{dateFormatter(value)}</span>,
    start: (value: string) => <span>{value || zeroHourPlaceholder}</span>,
    end: (value: string) => <span>{value || zeroHourPlaceholder}</span>,
  };

  const table = useTable<ProductionCalendarDayMapped>({
    dataSource: productionCalendarDaysMapped,
    translateHeader: translateTable,
    customColumns: customColumns,
    renderDeleteButton: false,
    rowKey: 'id',
    columnsOrder: columnsOrder,
    usePaging: false,
    onEdit: onEdit,
    hasViewOnlyElements: true,
    height: 600,
  });

  return (
    <div className='production-calendar-form'>
      <ProductionCalendarInputs checking={checking} ns={ns} exportToExcel={exportToExcel} />
      {tabsArray && (
        <Tabs
          items={tabsArray.map((month: [string, ProductionCalendarDay[]]) => ({
            key: String(month[1][0].id),
            label: translateMonths(month[0]),
          }))}
          onChange={(activeKey: string): void => setActiveTableKey(Number(activeKey))}
        />
      )}
      {table}
      <ProductionCalendarDayModal productionCalendarDay={selectedPCDay} onClose={onClose} />
    </div>
  );
};

export default ProductionCalendarsChecking;
