/**@module SimulationSlice */
import { createSlice } from '@reduxjs/toolkit';
import { initialSimulationState } from './states';
import { getSimulationData } from './thunks';

const simulation = createSlice({
  name: 'simulation',
  initialState: initialSimulationState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSimulationData.fulfilled, (state, action) => {
      const {
        simulationDataOverview,
        workCenterSimulation,
        realDataOverview,
        routingsDeliveryDates,
      } = action.payload;

      state.loading = false;
      state.error = undefined;
      state.realDataOverview = realDataOverview;
      state.simulationDataOverview = simulationDataOverview;
      state.workCenterSimulation = workCenterSimulation;
      state.routingsDeliveryDates = routingsDeliveryDates;
    });
    builder.addCase(getSimulationData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getSimulationData.pending, (state) => {
      state.loading = true;
    });
  },
});

export const simulationReducer = simulation.reducer;
