/** @module SimulationThunks */
import ApiService from '@/modules/shared/services/api.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockedSimulationData } from '../../../simulation/mockedSimulationData';
import { BASE_SIMULATION_API } from '../../consts/apiUrl';
import { SimulationDataOverview, SimulationFormData } from './interfaces';
/**Gets routing delivery dates and simulated work center data for the simulation page */
export const getSimulationData = createAsyncThunk(
  BASE_SIMULATION_API,
  async (simulationFormData: SimulationFormData, { rejectWithValue }) => {
    try {
      const response = await ApiService.post<SimulationDataOverview>(
        BASE_SIMULATION_API,
        simulationFormData,
      );
      const { data } = response;
      return data;

      //return mockedSimulationData;
    } catch (err: any) {
      return rejectWithValue(err.response ? err.response.status : err.message);
    }
  },
);
