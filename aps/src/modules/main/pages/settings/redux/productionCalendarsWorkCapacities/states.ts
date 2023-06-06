/**
 * @module ProductionCalendarWorkCapacitiesStates
 */

import { ProductionCalendarWorkCapacitiesResponse } from './interfaces';
/**
 * Production calendar work capacities Initial state used in {@link ProductionCalendarWorkCapacitiesSlice}
 */
export const initialPCWorkCapacitiesState: ProductionCalendarWorkCapacitiesResponse = {
  loading: true,
  error: undefined,
  holidays: [],
  workCapacities: [],
  productionCalendarIds:[],
};
