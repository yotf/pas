/**
 * @module EmptyRouting
 */

import dayjs from 'dayjs';
/**
 * New {@link SimulationRouting } with initial values.
 */
export const emptyRouting = {
  routingId: undefined,
  quantity: 0,
  numberOfPOs: 0,
  repeat: 0,
  routingInitialDate: dayjs().add(1, 'day').toISOString(),
  routingDeliveryDate: undefined,
};
