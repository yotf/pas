import { createSlice } from "@reduxjs/toolkit";
import { getSalesOrdersWithMaterials } from "./thunks";
import { InitilSalesOrdersWithMaterialsState } from "./states";


const salesOrdersWithMaterialsSlice = createSlice({
    name: 'salesOrdersWithMaterials',
    initialState: InitilSalesOrdersWithMaterialsState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSalesOrdersWithMaterials.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
            state.error = undefined;
        });
        builder.addCase(getSalesOrdersWithMaterials.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(getSalesOrdersWithMaterials.pending, (state) => {
            state.loading = true;
            state.error = undefined;
        });

    }
});

export const salesOrdersWithMaterialsReducer = salesOrdersWithMaterialsSlice.reducer;