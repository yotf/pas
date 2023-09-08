/**@module WorkCenterSlice */
import { createEntitySlice } from '../slice';
import { WorkCenter, WorkCenterFormData, WorkCenterResponse } from '../workCenters/interfaces';
//import { WorkCenter, WorkCenterFormData, WorkCenterResponse } from 
import { WorkCenterThunks } from './thunks';
/**
 * Slice created by {@link CrudSlice}
 */
const workCenterWithOperationsSlice = createEntitySlice<
  WorkCenter,
  WorkCenterResponse,
  WorkCenterFormData
>('workCenterWithOperationsSlice', (entity) => [entity.name], WorkCenterThunks);
export const { filterEntities: filterWorkCenters, clearEntity: clearWorkCenter } =
  workCenterWithOperationsSlice.actions;
export const workCentersWithOperationsReducer = workCenterWithOperationsSlice.reducer;
