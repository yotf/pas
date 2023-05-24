/**@module SimulationStates */
import { DataOverview, SimulationResponse } from './interfaces';
/**Simulation initial state. Used in {@link SimulationSlice} */
export const initialSimulationState: SimulationResponse = {
  loading: true,
  error: undefined,
  realDataOverview: {} as DataOverview,
  simulationDataOverview: {} as DataOverview,
  workCenterSimulation: [],
  routingsDeliveryDates: [],
};
