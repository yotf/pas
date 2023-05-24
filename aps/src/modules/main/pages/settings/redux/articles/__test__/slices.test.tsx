import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { articlesReducer, filterArticles } from '../slice';
import { initialSettingsState } from '../states';
import { getAllArticles } from '../thunks';

test('Articles - should return the initial state', () => {
  expect(articlesReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Articles - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const articles = await articlesReducer(previousState, filterArticles('1'));

  expect(articles).toEqual({
    filtered: [
      {
        code: 'test 1',
        name: 'test 1',
        id: 1,
      },
    ],
    data: mockedSettingsData,
  });
});

test('Fetch articles fulfilled', async () => {
  const action = { type: getAllArticles.fulfilled.type, payload: mockedSettingsData };
  const state = articlesReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch articles rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllArticles.rejected.type, error: expectedWithError };
  const state = articlesReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
