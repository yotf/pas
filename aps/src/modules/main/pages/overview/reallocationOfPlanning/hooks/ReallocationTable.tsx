/**
 * @module ReallocationTable
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter, mapDataToOptions } from '@/modules/shared/utils/utils';
import { FC, ReactNode, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PORoutingOperations } from '../../../settings/redux/productionOrders/interfaces';
import {
  ReallocationOfPlanningForm,
  ReallocationOperationMapped,
} from '../../../settings/redux/reallocationOfPlanning/interfaces';
import { useReallocationMappedData } from './useReallocationMappedData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllWorkCentersWithOperations } from '../../../settings/redux/workCenters copy/thunks';

/**
 *
 * @returns Reallocation of planning table with operations from selected production order
 */
export const ReallocationTable: FC = (): JSX.Element => {
  const { translate } = useTranslate({ ns: 'reallocationOfPlanning' });
  // const { workCenterOptions } = useStatisticsOptions();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllWorkCentersWithOperations());
  }, [dispatch]);

  const workCentersWithOperations = useAppSelector((state) => state.workCenterWithOperations.data);

  const form = useFormContext<ReallocationOfPlanningForm>();

  const { control, getValues } = form;

  useFieldArray({
    control,
    name: 'reallocationOperations',
    keyName: 'fieldId',
  });

  //const POSchedule = mockedProductionOrder.statusOfPlanningEnum === 2;

  const columnsOrder: (keyof ReallocationOperationMapped)[] = useMemo(
    () => [
      'sequence',
      'operationId',
      'operationName',
      'workCenterId',
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
      const options = mapDataToOptions(
        workCentersWithOperations.filter((wc) =>
          wc.allowedOperations.find((op) => op.operationId === record.operationId),
        ),
      );
      debugger;

      return (
        <CustomInput
          type={'select'}
          options={options}
          width={'full-width'}
          name={`reallocationOperations[${index}].workCenterId`}
          isAutocomplete={true}
          disabled={record.executedDate || record.skipped}
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
        disabled={record.skipped || record.executedDate}
        noPastDates={true}
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
