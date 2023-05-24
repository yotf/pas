import { mockedSettingsData } from '@/modules/shared/test-config/helpers/consts/settings-page-mock';
import { SettingsPagesResponse } from '../../../consts/interfaces';
import { filterProductionOrderTypes, productionOrderTypesReducer } from '../slice';
import { initialSettingsState } from '../states';
import { getAllProductionOrderTypes } from '../thunks';

test('Production order types - should return the initial state', () => {
  expect(productionOrderTypesReducer(undefined, { type: undefined })).toEqual({
    loading: true,
    error: undefined,
    data: [],
    filtered: [],
  });
});

test('Production order types - should filter an array', async () => {
  const previousState: SettingsPagesResponse = {
    data: mockedSettingsData,
    filtered: mockedSettingsData,
  };

  const unitOfMeasure = await productionOrderTypesReducer(
    previousState,
    filterProductionOrderTypes('1'),
  );

  expect(unitOfMeasure).toEqual({
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

test('Fetch production order types fulfilled', async () => {
  const action = { type: getAllProductionOrderTypes.fulfilled.type, payload: mockedSettingsData };
  const state = productionOrderTypesReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toBe(undefined);
  expect(state.data).toEqual(mockedSettingsData);
  expect(state.filtered).toEqual(state.data);
});

test('Fetch production order types rejected', async () => {
  const expectedWithError = {
    message: 'error message',
  };
  const action = { type: getAllProductionOrderTypes.rejected.type, error: expectedWithError };
  const state = productionOrderTypesReducer(initialSettingsState, action);
  expect(state.loading).not.toBeTruthy();
  expect(state.error).toEqual(expectedWithError.message);
  expect(state.data).toEqual([]);
  expect(state.filtered).toEqual(state.data);
});
