/**
 * @module CustomersSlice
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsPageItem, SettingsValidationError } from '../../consts/interfaces';

import { initialSettingsState } from './states';
import { deleteCustomersThunk, getAllCustomers, upsertCustomerThunk } from './thunks';

const customersSlice = createSlice({
  name: 'customersSlice',
  initialState: initialSettingsState,
  reducers: {
    /**
     *
     * @param state State of type {@link SettingsInterfaces.SettingsPagesResponse}
     * @param action Action with payload type {@link SettingsInterfaces.SettingsPagesResponse}
     * Filters customers by values inputed in search input
     */
    filterCustomers: (state, action: PayloadAction<string>) => {
      state.filtered = state.data.filter((uom: SettingsPageItem) => {
        const searchCriteria = action.payload?.toLowerCase();
        return (
          uom.code?.toLowerCase().includes(searchCriteria) ||
          uom.name.toLowerCase().includes(searchCriteria) ||
          uom.country?.toLowerCase().includes(searchCriteria)
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.filtered = state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllCustomers.rejected, (state, action) => {
      state.loading = false;
      state.filtered = state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(upsertCustomerThunk.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.validationErrors = undefined;
    });
    builder.addCase(upsertCustomerThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(upsertCustomerThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
      if (action.payload.type === 'validationErrors') {
        state.validationErrors = action.payload.errors as SettingsValidationError[];
      }
    });
    builder.addCase(deleteCustomersThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCustomersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.data = state.data.filter(({ id }) => id !== action.payload);
      state.filtered = state.data;
    });
    builder.addCase(deleteCustomersThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { filterCustomers } = customersSlice.actions;

export const customersReducer = customersSlice.reducer;
