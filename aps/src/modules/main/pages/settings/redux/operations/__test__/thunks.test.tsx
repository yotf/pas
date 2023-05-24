import {
  mockedOperation,
  mockedOperationsData,
} from '@/modules/main/pages/operations/__test__/consts';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import axiosInstance from '@/services/setup/api';
import { Operation } from '../interfaces';
import {
  deleteOperationThunk,
  getAllOperations,
  getOperation,
  upsertOperationThunk,
} from '../thunks';

const errorMessage = 'error message';

describe('operations get thunk', () => {
  test('should return operations on success', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedOperationsData });

    const dispatch = getDispatch();
    const response = await dispatch(getAllOperations());
    const result: Operation[] = response.payload as Operation[];
    expect(result).toEqual(mockedOperationsData);
    expect(getSpy).toHaveBeenCalled();
  });

  test('should return error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(getAllOperations());
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});

describe('delete operation', async () => {
  it('should delete operation on success', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockResolvedValueOnce({ data: mockedOperation.id });

    const dispatch = getDispatch();
    const response = await dispatch(deleteOperationThunk(mockedOperation.id));

    const result: unknown = response.payload;
    expect(result).toEqual(mockedOperation.id);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(deleteOperationThunk(mockedOperation.id));

    expect(response.payload).toEqual(errorMessage);
    expect(deleteSpy).toHaveBeenCalled();
  });
});

describe('post-put material group', async () => {
  it('should put material group when given id', async () => {
    const putSpy = vi.spyOn(axiosInstance, 'put').mockResolvedValueOnce({ data: mockedOperation });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedOperation });

    const dispatch = getDispatch();
    const response = await dispatch(upsertOperationThunk(mockedOperation));

    const result: Operation = response.payload as Operation;
    expect(mockedOperation.id).toEqual(result.id);
    expect(putSpy).toHaveBeenCalled();
  });

  it('should post operation when no id', async () => {
    const postSpy = vi
      .spyOn(axiosInstance, 'post')
      .mockResolvedValueOnce({ data: mockedOperation });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedOperation });

    const dispatch = getDispatch();
    const response = await dispatch(upsertOperationThunk({ ...mockedOperation, id: 0 }));

    const result: Operation = response.payload as Operation;
    expect(mockedOperation.id).toEqual(result.id);
    expect(postSpy).toHaveBeenCalled();
  });

  it('should return an error on fail', async () => {
    const putSpy = vi
      .spyOn(axiosInstance, 'put')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    const dispatch = getDispatch();
    const response = await dispatch(upsertOperationThunk(mockedOperation));

    const result: Operation = response.payload as Operation;
    expect(result).toEqual(errorMessage);
    expect(putSpy).toHaveBeenCalled();
  });
});

describe('get operation', () => {
  it('should get operation data when on success', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedOperation });

    const dispatch = getDispatch();
    const response = await dispatch(getOperation(mockedOperation.id));

    const result: Operation = response.payload as Operation;
    expect(mockedOperation.id).toEqual(result.id);
    expect(getSpy).toHaveBeenCalled();
  });
  it('should return an error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    const dispatch = getDispatch();
    const response = await dispatch(getOperation(mockedOperation.id));

    const result: Operation = response.payload as Operation;
    expect(result).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});
