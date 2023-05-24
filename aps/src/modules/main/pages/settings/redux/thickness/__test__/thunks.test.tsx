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
import { deleteThicknessThunk, getAllThickness, upsertThicknessThunk } from '../thunks';

describe('thicknesses thunk', () => {
  it('should return thicknesses on success', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(getAllThickness());
    const result: SettingsPageItem[] = response.payload as SettingsPageItem[];
    expect(result).toEqual(mockedSettingsData);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const getSpy = vi
      .spyOn(axiosInstance, 'get')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(getAllThickness());
    expect(response.payload).toEqual(errorMessage);
    expect(getSpy).toHaveBeenCalled();
  });
});

describe('delete thickness', async () => {
  it('should delete thickness on success', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockResolvedValueOnce({ data: mockedSettingsItem.id });

    const dispatch = getDispatch();
    const response = await dispatch(deleteThicknessThunk(mockedSettingsItem.id));

    const result: unknown = response.payload;
    expect(result).toEqual(mockedSettingsItem.id);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should return error on fail', async () => {
    const deleteSpy = vi
      .spyOn(axiosInstance, 'delete')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));
    const dispatch = getDispatch();
    const response = await dispatch(deleteThicknessThunk(mockedSettingsItem.id));

    expect(response.payload).toEqual(errorMessage);
    expect(deleteSpy).toHaveBeenCalled();
  });
});

describe('post-put thickness', async () => {
  it('should put thickness when given id', async () => {
    const putSpy = vi
      .spyOn(axiosInstance, 'put')
      .mockResolvedValueOnce({ data: mockedSettingsItem });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(upsertThicknessThunk(mockedSettingsItem));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(mockedSettingsItem.id).toEqual(result.id);
    expect(putSpy).toHaveBeenCalled();
  });

  it('should post thickness when no id', async () => {
    const postSpy = vi
      .spyOn(axiosInstance, 'post')
      .mockResolvedValueOnce({ data: mockedSettingsItemForPut });
    vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: mockedSettingsData });

    const dispatch = getDispatch();
    const response = await dispatch(upsertThicknessThunk(mockedSettingsItemForPost));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(mockedSettingsItem.name).toEqual(result.name);
    expect(postSpy).toHaveBeenCalled();
  });

  it('should return an error on fail', async () => {
    const putSpy = vi
      .spyOn(axiosInstance, 'put')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    const dispatch = getDispatch();
    const response = await dispatch(upsertThicknessThunk(mockedSettingsItem));

    const result: SettingsPageItem = response.payload as SettingsPageItem;
    expect(result).toEqual(errorMessage);
    expect(putSpy).toHaveBeenCalled();
  });
});
