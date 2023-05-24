/**@module WorkCenterThunks */
import { BASE_WORK_CENTERS_API } from '../../consts/apiUrl';
import { createCrudThunks } from '../thunks';
import { WorkCenter, WorkCenterFormData, WorkCenterResponse } from './interfaces';
/**
 * Thunks created by {@link CrudThunks} function. Used for {@link WorkCenterSlice}
 */
export const WorkCenterThunks = createCrudThunks<
  WorkCenter,
  WorkCenterResponse,
  WorkCenterFormData
>(BASE_WORK_CENTERS_API);
export const {
  listThunk: getAllWorkCenters,
  readThunk: getWorkCenter,
  upsertThunk: upsertWorkCenterThunk,
  deleteThunk: deleteWorkCenterThunk,
} = WorkCenterThunks;
