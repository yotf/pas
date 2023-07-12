/**
 * @module useWorkCenterTableSetup
 */

import { timeFormat } from '@/modules/shared/consts';
import { useTable } from '@/modules/shared/hooks/table/table.hook';
import { DayOfWeek } from '@/modules/shared/utils/dayOfWeek.enum';
import { useAppDispatch } from '@/store/hooks';
import dayjs from 'dayjs';
import { ReactNode, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { AllowedOperationMapped } from '../../settings/redux/allowedOperations/interfaces';
import { getAllAllowedOperationsByWorkCenterId } from '../../settings/redux/allowedOperations/thunks';
import {
  WorkCapacity,
  WorkCapacityMapped,
} from '../../settings/redux/workcenterCapacities/interfaces';
import { getAllWorkCapacitiesByWorkCenterId } from '../../settings/redux/workcenterCapacities/thunks';
import { WorkCenterFormData } from '../../settings/redux/workCenters/interfaces';

export type WorkCenterTableProps = {
  activeGroup: boolean;
  translate: (value: string, options?: Record<string, string> | undefined) => string;
  onEdit?: (value: WorkCapacityMapped | AllowedOperationMapped) => void;
};

const columnsOrderWorkCapacity: (keyof WorkCapacityMapped)[] = [
  'id',
  'dayOfWeek',
  'start',
  'break',
  'end',
  'minutes',
  'efficiency',
  'availableMinutes',
  'capacity',
];

const columnsOrderAllowedOperation: (keyof AllowedOperationMapped)[] = ['id', 'code', 'operation'];

type ColumnsOrderType = (keyof WorkCapacityMapped)[] | (keyof AllowedOperationMapped)[];
/**
 * Maps work capacities or allowed operation for table. Returns table with one of the 2 groups depending on activeGroup prop.
 * @param activeGroup Selects which data is active
 * @param onEdit Function which selects a work capacity and opens {@link WorkCapacityModal}
 */
export const useWorkCenterTableSetup = ({
  activeGroup,
  translate,
  onEdit,
}: WorkCenterTableProps): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { watch } = useFormContext<WorkCenterFormData>();
  const { workCapacities: workCenterCapacities, allowedOperations } = watch();

  const sortWorkCapacities = (arr: WorkCapacity[]): WorkCapacity[] => {
    const [first, ...rest] = arr;
    return [...rest, first];
  };

  const workCenterCapacitiesMapped = useMemo(() => {
    if (!workCenterCapacities) return [];
    return sortWorkCapacities(workCenterCapacities).map((obj): WorkCapacityMapped => {
      const minutes =
        dayjs(obj.end, timeFormat).diff(dayjs(obj.start, timeFormat), 'minute') - obj.break;
      const availableMinutes = minutes * (obj.efficiency / 100);
      const availableMinutesRounded = Math.round(availableMinutes);
      return {
        id: obj.id,
        dayOfWeek: obj.dayOfWeek,
        start: obj.start || '00:00',
        break: obj.break,
        end: obj.end || '00:00',
        minutes: minutes || 0,
        availableMinutes: availableMinutesRounded || 0,
        capacity: obj.capacity,
        efficiency: obj.efficiency,
        guid: uuid(),
      };
    });
  }, [workCenterCapacities]);

  const allowedOperationsMapped = useMemo(() => {
    if (!allowedOperations) return [];
    return allowedOperations.map(
      (obj): AllowedOperationMapped => ({
        id: obj.id,
        code: obj.operationId,
        operation: obj?.operation.name,
        guid: uuid(),
      }),
    );
  }, [allowedOperations]);

  const currentData: (WorkCapacityMapped | AllowedOperationMapped)[] = useMemo(
    () => (activeGroup ? workCenterCapacitiesMapped : allowedOperationsMapped),
    [allowedOperationsMapped, activeGroup, workCenterCapacitiesMapped],
  );

  const columnsOrder: ColumnsOrderType = useMemo(
    () => (activeGroup ? columnsOrderWorkCapacity : columnsOrderAllowedOperation),
    [allowedOperationsMapped, activeGroup, workCenterCapacitiesMapped],
  );

  const customColumns: Partial<Record<keyof WorkCapacityMapped, (value: any) => ReactNode>> = {
    dayOfWeek: (value: number) => <span>{translate(String(DayOfWeek[value]))}</span>,
  };

  const handleRowDoubleClick = (
    record: any,
    index: number | undefined,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    onEdit ? onEdit(record) : null;
  };

  const isWorkCapacity = activeGroup === true;

  const table = useTable<WorkCapacityMapped | AllowedOperationMapped>({
    dataSource: currentData,
    translateHeader: translate,
    customColumns: customColumns,
    usePaging: isWorkCapacity ? false : true,
    onEdit: onEdit,
    useActions: activeGroup,
    renderDeleteButton: false,
    rowKey: 'guid',
    columnsOrder: columnsOrder as any,
    handleRowDoubleClick: handleRowDoubleClick,
  });
  useEffect(() => {
    dispatch(getAllWorkCapacitiesByWorkCenterId(Number(id ?? 0)));
    dispatch(getAllAllowedOperationsByWorkCenterId(Number(id ?? 0)));
  }, [dispatch, id]);

  return table;
};
