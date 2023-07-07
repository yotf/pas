import { createSlice } from "@reduxjs/toolkit";
import { initialSettingsState } from "./states";
import { getConfiguration, postConfigurationThunk } from "./thunks";
import { getConfig } from "@testing-library/react";


const configurationSlice = createSlice({
    name: "configurationSlice",
    initialState: initialSettingsState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(postConfigurationThunk.pending, (state) => {
            state.loading = true;
            state.error = undefined;
            
          });
          builder.addCase(postConfigurationThunk.fulfilled, (state) => {
            state.loading = false;
            state.error = undefined;
          });
          builder.addCase(postConfigurationThunk.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.error.message
          });
        
          builder.addCase(getConfiguration.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = undefined;
          });
          builder.addCase(getConfiguration.rejected, (state, action) => {
            state.loading = false;

            state.error = action.error.message;
          });
    }
})


export const configurationReducer = configurationSlice.reducer;