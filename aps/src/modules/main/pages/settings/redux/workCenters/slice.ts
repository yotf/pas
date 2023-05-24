/**@module WorkCenterSlice */
import { createEntitySlice } from '../slice';
import { WorkCenter, WorkCenterFormData, WorkCenterResponse } from './interfaces';
import { WorkCenterThunks } from './thunks';
/**
 * Slice created by {@link CrudSlice}
 */
const workCenterSlice = createEntitySlice<WorkCenter, WorkCenterResponse, WorkCenterFormData>(
  'workCenterSlice',
  (entity) => [entity.name],
  WorkCenterThunks,
);
export const { filterEntities: filterWorkCenters, clearEntity: clearWorkCenter } =
  workCenterSlice.actions;
export const workCentersReducer = workCenterSlice.reducer;
