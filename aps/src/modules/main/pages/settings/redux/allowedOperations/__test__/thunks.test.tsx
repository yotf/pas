import { describe } from 'vitest';
import axiosInstance from '@/services/setup/api';
import { mockedAllowedOperations } from '@/modules/main/pages/workCenter/__test__/consts';
import { getAllAllowedOperationsByWorkCenterId } from '../thunks';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import { AllowedOperation } from '../interfaces';
import { errorMessage } from '../../user/__test__/consts';

describe('allowed operations thunk', () => {
  it('should return allowed operations on success', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedAllowedOperations });

    const dispatch = getDispatch();
    const response = await dispatch(getAllAllowedOperationsByWorkCenterId(1));
    const result: AllowedOperation[] = response.payload as AllowedOperation[];
    expect(result).toEqual(mockedAllowedOperations);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(getAllAllowedOperationsByWorkCenterId(1));
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});
