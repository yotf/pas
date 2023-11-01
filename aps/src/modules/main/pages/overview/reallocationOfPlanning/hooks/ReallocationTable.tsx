/**
 * @module ReallocationTable
 */

import CustomInput from '@/modules/shared/components/input/input.component';
import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { useTranslate } from '@/modules/shared/hooks/translate.hook';
import { dateFormatter, mapDataToOptions } from '@/modules/shared/utils/utils';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PORoutingOperations } from '../../../settings/redux/productionOrders/interfaces';
import {
  ReallocationOfPlanningForm,
  ReallocationOperationMapped,
} from '../../../settings/redux/overview/reallocationOfPlanning/interfaces';
import { useReallocationMappedData } from './useReallocationMappedData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllWorkCentersWithOperations } from '../../../settings/redux/workCenters copy/thunks';
import { ReallocationData } from '../useReallocationOfPlanningModal';
import dayjs from 'dayjs';

/**
 *
 * @returns Reallocation of planning table with operations from selected production order
 */

type ReallocationTableProps = {
  selectedPOId: number | undefined;
  openReallocationConfirmModal: (data: ReallocationData) => void;
};

export const ReallocationTable: FC<ReallocationTableProps> = ({
  selectedPOId,
  openReallocationConfirmModal,
}): JSX.Element => {
  const { translate } = useTranslate({ ns: 'reallocationOfPlanning' });
  const { entity } = useAppSelector((state) => state.productionOrders);

  // const { workCenterOptions } = useStatisticsOptions();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllWorkCentersWithOperations());
  }, [dispatch]);

  const workCentersWithOperations = useAppSelector((state) => state.workCenterWithOperations.data);

  const form = useFormContext<ReallocationOfPlanningForm>();

  const { control, getValues, register } = form;

  useFieldArray({
    control,
    name: 'reallocationOperations',
    keyName: 'fieldId',
  });

  //const POSchedule = mockedProductionOrder.statusOfPlanningEnum === 2;

  const handleWorkCenterReallocation = (
    newValue: any,
    option: any,
    record: ReallocationOperationMapped,
  ) => {
    const reallocationData: ReallocationData = {
      productionOrderId: selectedPOId!,
      workCenterId: newValue,
      pO_RoutingId: record.pO_RoutingOperationId,
      // planningDate: dayjs(record.planningDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      limitCapacity: getValues().limitCapacity!,
    };
    openReallocationConfirmModal(reallocationData);
  };

  const handleDateReallocation = (newValue: any, record: ReallocationOperationMapped) => {
    const reallocationData: ReallocationData = {
      productionOrderId: selectedPOId!,
      //workCenterId: newValue,
      pO_RoutingId: record.pO_RoutingOperationId,
      planningDate: dayjs(newValue).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      limitCapacity: getValues().limitCapacity!,
    };
    openReallocationConfirmModal(reallocationData);
  };

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

      return (
        <CustomInput
          type={'select'}
          options={options}
          width={'full-width'}
          name={`reallocationOperations[${index}].workCenterId`}
          isAutocomplete={true}
          disabled={record.executedDate || record.skipped}
          allowClear={false}
          handleSelectionChange={(value, option) =>
            handleWorkCenterReallocation(value, option, record)
          }
        ></CustomInput>
      );
    },
    executedDate: (value) => <span>{dateFormatter(value)}</span>,
    planningDate: (_value, record, index) => {
      const previousPlanningDate = getValues().reallocationOperations?.[index - 1]?.planningDate;
      const previousLeadTime = getValues().reallocationOperations?.[index - 1]?.leadTime;
      return (
        <CustomInput
          type={'date'}
          width={'full-width'}
          name={`reallocationOperations[${index}].planningDate`}
          disableDatesFrom={
            previousPlanningDate && dayjs(previousPlanningDate).isAfter(dayjs())
              ? dayjs(previousPlanningDate).add(previousLeadTime ?? 0, 'day')
              : undefined
          }
          value={record.planningDate}
          allowClear={false}
          disabled={record.skipped || record.executedDate}
          handleSelectionChange={(value) => handleDateReallocation(value, record)}
          noPastDates={true}
        ></CustomInput>
      );
    },
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
