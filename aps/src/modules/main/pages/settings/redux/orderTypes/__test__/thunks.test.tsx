import {
  mockedSettingsData,
  mockedSettingsItem,
  mockedSettingsItemForPost,
  mockedSettingsItemForPut,
} from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { getDispatch } from '@/modules/shared/test-config/helpers/dispatchHelper';
import axiosInstance from '@/services/setup/api';
import { SettingsPageItem } from '../../../consts/interfaces';
import { errorMessage } from '../../user/__test__/consts';
import { deleteOrderTypesThunk, getAllOrderTypes, upsertOrderTypes } from '../thunks';

describe('order types thunk', () => {
  it('should return order types on success', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(getAllOrderTypes());
    const result: SettingsPageItem[] = response.payload as SettingsPageItem[];
    expect(result).toEqual(mockedSettingsData);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(getAllOrderTypes());
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});

describe('delete order type', async () => {
  it('should delete order type on success', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockResolvedValueOnce({ data: mockedSettingsItem.id });

    const dispatch = getDispatch();
    const response = await dispatch(deleteOrderTypesThunk(mockedSettingsItem.id));

    const result: unknown = response.payload;
    expect(result).toEqual(mockedSettingsItem.id);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(deleteOrderTypesThunk(mockedSettingsItem.id));

    expect(response.payload).toEqual(errorMessage);
    expect(deleteSpy).toHaveBeenCalled();
  });
});

describe('post-put order type', async () => {
  it('should put order type when given id', async () => {
    const putSpy = vi
      .spyOn(axiosInstance, 'put')
      .mockResolvedValueOnce({ data: mockedSettingsItem });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(upsertOrderTypes(mockedSettingsItem));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(mockedSettingsItem.id).toEqual(result.id);
    expect(putSpy).toHaveBeenCalled();
  });

  it('should post order type when no id', async () => {
    const postSpy = vi
      .spyOn(axiosInstance, 'post')
      .mockResolvedValueOnce({ data: mockedSettingsItemForPut });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(upsertOrderTypes(mockedSettingsItemForPost));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(mockedSettingsItem.name).toEqual(result.name);
    expect(postSpy).toHaveBeenCalled();
  });

  it('should return an error on fail', async () => {
    const putSpy = vi
      .spyOn(axiosInstance, 'put')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    const dispatch = getDispatch();
    const response = await dispatch(upsertOrderTypes(mockedSettingsItem));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(result).toEqual(errorMessage);
    expect(putSpy).toHaveBeenCalled();
  });
});
