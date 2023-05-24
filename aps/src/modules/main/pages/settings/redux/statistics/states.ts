/**@module StatisticsStates */
import { StatisticsGeneratedData, StatisticsResponse } from './interfaces';
/**Statistics initial state used in {@link StatisticsSlice} */
export const initialStatisticsState: StatisticsResponse = {
  loading: true,
  error: undefined,
  data: {} as StatisticsGeneratedData,
  delayedOrders: [],
};
