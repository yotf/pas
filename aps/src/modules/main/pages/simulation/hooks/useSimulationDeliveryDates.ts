/**
 * @module useSimulationDeliveryDates
 */

import { useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RoutingInputs, SimulationFormData } from '../../settings/redux/simulation/interfaces';
/**
 *
 * @param form Form from {@link SimulationPage}
 * Fills the routings user filled with values with data recieved from the API.
 */
export const useSimulationDeliveryDates = (form: UseFormReturn<SimulationFormData, any>): void => {
  const { routingsDeliveryDates } = useAppSelector((state) => state.simulation);
  const { watch, setValue } = form;

  const { routings } = watch();

  const newRoutings = useMemo(() => {
    const routingsMapped: RoutingInputs[] = routings?.map((rf) => {
      const found = routingsDeliveryDates?.find((rdd: any) => rdd.routingId === rf.routingId);
      if (found) {
        return { ...rf, routingDeliveryDate: found.deliveryDate! };
      }
      return rf;
    });
    return routingsMapped;
  }, [JSON.stringify(routings), JSON.stringify(routingsDeliveryDates)]);

  useEffect(() => {
    setValue('routings', newRoutings);
  }, [JSON.stringify(routingsDeliveryDates), setValue]);
};
