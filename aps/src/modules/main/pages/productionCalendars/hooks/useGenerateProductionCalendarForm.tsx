/**
 * @module useGenerateProductionCalendarForm
 */

import { useCallback, useMemo } from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import { useMaintainForm } from '../../../components/maintain/hooks/useMaintainForm';
import {
  GenerateProductionCalendarFormData,
  ProductionCalendarResponse,
  ProductionCalendarsResponse,
} from '../../settings/redux/productionCalendars/interfaces';
import { clearProductionCalendars } from '../../settings/redux/productionCalendars/slices';
import { getProductionCalendar } from '../../settings/redux/productionCalendars/thunks';
import { WorkCenter } from '../../settings/redux/workCenters/interfaces';
import { useGenerateProductionCalendarSchema } from './useGenerateProductionCalendarSchema';

export type UseProductionCalendarsFormType = {
  copy?: boolean;
  state: ProductionCalendarsResponse;
};
/**
 * Creates a mapping function and a indicates which fields cannot be duplicated. Creates a validation schema using {@link useGenerateProductionCalendarSchema}.
 * Mentioned values are passed down to {@link useMaintainForm}.
 * @returns A form created by {@link useMaintainForm}.
 */
export const useProductionCalendarForm = ({
  state,
}: UseProductionCalendarsFormType): UseFormReturn<GenerateProductionCalendarFormData, any> => {
  const duplicateErrors: Record<string, Path<GenerateProductionCalendarFormData>> = useMemo(
    () => ({
      duplicateError: 'workCenterIds',
    }),
    [],
  );
  const validationSchema = useGenerateProductionCalendarSchema();

  const mapEntityToFormData: (entity?: ProductionCalendarResponse) => any = useCallback(
    (entity: any) =>
      !entity || entity?.id === 0
        ? { workCenterId: [], initialDate: '', finalDate: '', holidays: [] }
        : {
            workCenterIds: entity.productionCalendarBaseInfoDto.workCenters.map(
              (wc: WorkCenter) => wc.id,
            ),
            initialDate: entity.productionCalendarBaseInfoDto.initialDate,
            finalDate: entity.productionCalendarBaseInfoDto.finalDate,
          },
    [],
  );
  const form = useMaintainForm({
    ns: 'productionCalendar',
    validationSchema,
    duplicateErrors,
    mapEntityToFormData,
    state,
    clearEntity: clearProductionCalendars,
    readThunk: getProductionCalendar,
  });

  return form;
};
