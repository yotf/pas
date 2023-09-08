/**@module WorkCenterThunks */
import { WORK_CENTERS_WITH_OPERATIONS_API } from '../../consts/apiUrl';
import { createCrudThunks } from '../thunks';
import { WorkCenter, WorkCenterResponse, WorkCenterFormData } from '../workCenters/interfaces';

/**
 * Thunks created by {@link CrudThunks} function. Used for {@link WorkCenterSlice}
 */
export const WorkCenterThunks = createCrudThunks<
  WorkCenter,
  WorkCenterResponse,
  WorkCenterFormData
>(WORK_CENTERS_WITH_OPERATIONS_API);
export const { listThunk: getAllWorkCentersWithOperations } = WorkCenterThunks;
