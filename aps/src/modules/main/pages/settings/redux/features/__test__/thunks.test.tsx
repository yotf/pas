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
import { deleteFeatureThunk, getAllFeatures, upsertFeatureThunk } from '../thunks';

describe('features thunk', () => {
  it('should return features on success', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(getAllFeatures());
    const result: SettingsPageItem[] = response.payload as SettingsPageItem[];
    expect(result).toEqual(mockedSettingsData);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(getAllFeatures());
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});

describe('delete feature', async () => {
  it('should delete feature on success', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockResolvedValueOnce({ data: mockedSettingsItem.id });

    const dispatch = getDispatch();
    const response = await dispatch(deleteFeatureThunk(mockedSettingsItem.id));

    const result: unknown = response.payload;
    expect(result).toEqual(mockedSettingsItem.id);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(deleteFeatureThunk(mockedSettingsItem.id));
    expect(response.payload).toEqual(errorMessage);
    expect(deleteSpy).toHaveBeenCalled();
  });
});

describe('post-put feature', async () => {
  it('should put feature when given id', async () => {
    const putSpy = vi
      .spyOn(axiosInstance, 'put')
      .mockResolvedValueOnce({ data: mockedSettingsItem });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(upsertFeatureThunk(mockedSettingsItem));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(mockedSettingsItem.id).toEqual(result.id);
    expect(putSpy).toHaveBeenCalled();
  });

  it('should post feature when no id', async () => {
    const postSpy = vi
      .spyOn(axiosInstance, 'post')
      .mockResolvedValueOnce({ data: mockedSettingsItemForPut });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(upsertFeatureThunk(mockedSettingsItemForPost));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(mockedSettingsItem.name).toEqual(result.name);
    expect(postSpy).toHaveBeenCalled();
  });

  it('should return an error on fail', async () => {
    const putSpy = vi
      .spyOn(axiosInstance, 'put')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    const dispatch = getDispatch();
    const response = await dispatch(upsertFeatureThunk(mockedSettingsItem));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(result).toEqual(errorMessage);
    expect(putSpy).toHaveBeenCalled();
  });
});
