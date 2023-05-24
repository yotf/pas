/**@module WorkCenterCapacitiesStates */
import { WorkCapacitesResponse } from './interfaces';
/**Work Center capacities initial state used in {@link WorkCenterCapacitiesSlice} */
export const initialWorkCapacitiesState: WorkCapacitesResponse = {
  loading: true,
  error: undefined,
  data: [],
};
