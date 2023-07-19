import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_SALES_ORDERS_MATERIALS_API } from "../../../consts/apiUrl";
import ApiService from "@/modules/shared/services/api.service";
import { SalesOrder } from "../interfaces";

export const getSalesOrdersWithMaterials = createAsyncThunk(
    BASE_SALES_ORDERS_MATERIALS_API, async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get<SalesOrder[]>(BASE_SALES_ORDERS_MATERIALS_API);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response ? err.response.status : err.message);
        }
}
);