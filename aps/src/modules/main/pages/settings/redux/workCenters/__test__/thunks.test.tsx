import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import axiosInstance from '@/services/setup/api';
import { WorkCenter } from '../interfaces';
import { getAllWorkCenters } from '../thunks';
import { mockedWorkCentersData } from './../../../../workCenter/__test__/consts';

const errorMessage = 'error message';

describe('work center thunk', () => {
  test('should return work center on success', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedWorkCentersData });

    const dispatch = getDispatch();
    const response = await dispatch(getAllWorkCenters());
    const result: WorkCenter[] = response.payload as WorkCenter[];
    expect(result).toEqual(mockedWorkCentersData);
    expect(getSpy).toHaveBeenCalled();
  });

  test('should return error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(getAllWorkCenters());
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});
