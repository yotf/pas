/**
 * @module EmptyRouting
 */

import dayjs from 'dayjs';
/**
 * New {@link SimulationRouting } with initial values.
 */
export const emptyRouting = {
  routingId: undefined,
  quantity: 1,
  numberOfPOs: 1,
  repeat: 1,
  routingInitialDate: dayjs().add(1, 'day').toISOString(),
  routingDeliveryDate: undefined,
};
