import ApiService from "@/modules/shared/services/api.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PRODUCTION_ORDER_GET_LINKED } from "../../../consts/apiUrl";
import { ProductionOrderFormData } from "../interfaces";
import { ProductionOrder } from "../interfaces";

type GetLinkedProductionOrdersParams = {
    salesOrderId: number;
    salesOrderMaterialId: number  ;
  };

export const getLinkedProductionOrders = createAsyncThunk(PRODUCTION_ORDER_GET_LINKED, async ({ salesOrderId, salesOrderMaterialId }: GetLinkedProductionOrdersParams, { rejectWithValue }) => {
    try {
      debugger;
      const response = await ApiService.get<ProductionOrder[]>(PRODUCTION_ORDER_GET_LINKED + `/${salesOrderId}/${salesOrderMaterialId}/`);
      const { data } = response;
      return data;
    } catch (err: any) {
      return rejectWithValue(err.reponse ? err.response.status : err.message);
    }
  }
  );