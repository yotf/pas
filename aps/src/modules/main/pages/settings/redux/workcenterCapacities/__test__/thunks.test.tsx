import { describe } from 'vitest';
import axiosInstance from '@/services/setup/api';
import { mockedWorkCapacities } from '@/modules/main/pages/workCenter/__test__/consts';
import { getAllWorkCapacitiesByWorkCenterId } from '../thunks';
import { WorkCapacity } from '../interfaces';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import { errorMessage } from '../../user/__test__/consts';
describe('work capacities thunk', () => {
  it('should return work capacities on success', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedWorkCapacities });

    const dispatch = getDispatch();
    const response = await dispatch(getAllWorkCapacitiesByWorkCenterId(1));
    const result: WorkCapacity[] = response.payload as WorkCapacity[];
    expect(result).toEqual(mockedWorkCapacities);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(getAllWorkCapacitiesByWorkCenterId(1));
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});
