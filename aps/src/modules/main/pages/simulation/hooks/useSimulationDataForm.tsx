/**
 * @module useSimulationDataForm
 */

import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DataOverview } from '../../settings/redux/simulation/interfaces';

export type UseSimulationDataFormProps = {
  simulationOverviewData: DataOverview;
  form: UseFormReturn<DataOverview, any>;
};
/**
 * @param simulationOverviewData Data to be represented in the {@link simulationDataOverview} component.
 * @param form Form to be filled with values
 */
export const useSimulationDataForm = ({
  simulationOverviewData,
  form,
}: UseSimulationDataFormProps): void => {
  const { setValue } = form;

  useEffect(() => {
    setValue('occupancy', simulationOverviewData?.occupancy ?? undefined);
    setValue('allocatedMinutes', simulationOverviewData?.allocatedMinutes ?? undefined);
    setValue('availableMinutes', simulationOverviewData?.availableMinutes ?? undefined);
    setValue('minutes', simulationOverviewData?.minutes ?? undefined);
    setValue('totalMinutes', simulationOverviewData?.totalMinutes ?? undefined);
  }, [setValue, simulationOverviewData]);
};
