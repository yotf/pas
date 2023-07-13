import { createSlice } from "@reduxjs/toolkit";
import { getLinkedProductionOrders } from "./thunks";
import { LinkedOrdersInitialState } from "./states";

const productonOrderLinkedOrdersSlice = createSlice({
    name: "linkedProductionOrderSlice",
    initialState: LinkedOrdersInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLinkedProductionOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.error = undefined;
            state.data = action.payload;
          })
        
    }
})

export const linkedProductionOrderReducer = productonOrderLinkedOrdersSlice.reducer;