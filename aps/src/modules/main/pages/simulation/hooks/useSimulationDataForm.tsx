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
    setValue(
      'occupancy',
      (simulationOverviewData?.occupancy &&
        Number(simulationOverviewData?.occupancy)?.toLocaleString('en', { useGrouping: true })) ??
        '',
    );
    setValue(
      'allocatedMinutes',
      simulationOverviewData?.allocatedMinutes
        ? Number(simulationOverviewData?.allocatedMinutes)?.toLocaleString('en', {
            useGrouping: true,
          })
        : '',
    );
    setValue(
      'availableMinutes',
      simulationOverviewData?.availableMinutes
        ? Number(simulationOverviewData?.availableMinutes)?.toLocaleString('en', {
            useGrouping: true,
          })
        : '',
    );
    setValue(
      'minutes',
      simulationOverviewData?.minutes
        ? Number(simulationOverviewData?.minutes)?.toLocaleString('en', { useGrouping: true })
        : '',
    );
    setValue(
      'totalMinutes',
      simulationOverviewData?.totalMinutes
        ? Number(simulationOverviewData?.totalMinutes)?.toLocaleString('en', { useGrouping: true })
        : '',
    );
  }, [setValue, simulationOverviewData]);
};
