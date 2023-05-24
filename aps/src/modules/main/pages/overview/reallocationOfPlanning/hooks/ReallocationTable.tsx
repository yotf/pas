/**
 * @module ReallocationTable
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter } from '@/modules/shared/utils/utils';
import { FC, ReactNode, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PORoutingOperations } from '../../../settings/redux/productionOrders/interfaces';
import {
  ReallocationOfPlanningForm,
  ReallocationOperationMapped,
} from '../../../settings/redux/reallocationOfPlanning/interfaces';
import { useStatisticsOptions } from '../../../statistics/hooks/useStatisticsOptions';
import { mockedProductionOrder } from '../mockedReallocationData';
import { useReallocationMappedData } from './useReallocationMappedData';

/**
 *
 * @returns Reallocation of planning table with operations from selected production order
 */
export const ReallocationTable: FC = (): JSX.Element => {
  const { translate } = useTranslate({ ns: 'reallocationOfPlanning' });
  const { workCenterOptions } = useStatisticsOptions();

  const form = useFormContext<ReallocationOfPlanningForm>();

  const { control, getValues } = form;

  useFieldArray({
    control,
    name: 'reallocationOperations',
    keyName: 'fieldId',
  });

  const POSchedule = mockedProductionOrder.statusOfPlanningEnum === 2;

  const columnsOrder: (keyof ReallocationOperationMapped)[] = useMemo(
    () => [
      'sequence',
      'operationId',
      'operationName',
      'workCenterId',
      'status',
      'operationTime',
      'setupTime',
      'leadTime',
      'planningDate',
      'executedDate',
    ],
    [],
  );

  const customColumns: Partial<
    Record<keyof PORoutingOperations, (value: any, record: any, index: number) => ReactNode>
  > = {
    workCenterId: (_value, record, index) => {
      return (
        <CustomInput
          type={'select'}
          options={workCenterOptions}
          width={'full-width'}
          name={`reallocationOperations[${index}].workCenterId`}
          isAutocomplete={true}
          disabled={POSchedule || record.executedDate}
          allowClear={false}
        ></CustomInput>
      );
    },
    executedDate: (value) => <span>{dateFormatter(value)}</span>,
    planningDate: (_value, record, index) => (
      <CustomInput
        type={'date'}
        width={'full-width'}
        name={`reallocationOperations[${index}].planningDate`}
        allowClear={false}
        disabled={POSchedule || record.executedDate}
      ></CustomInput>
    ),
  };

  const mappedData = useReallocationMappedData(getValues().reallocationOperations ?? []);

  const table = useTable({
    rowKey: 'id',
    dataSource: mappedData,
    translateHeader: translate,
    usePaging: false,
    useActions: false,
    customColumns: customColumns,
    columnsOrder: columnsOrder,
    preventSort: true,
  });

  return table;
};
