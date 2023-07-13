import BaseResponse from "@/modules/shared/services/interfaces";
import { ProductionOrder } from "../interfaces";

export interface LinkedPOInitialStateResponse extends BaseResponse {
    data?: ProductionOrder[];
  }

export const LinkedOrdersInitialState:LinkedPOInitialStateResponse={
    loading: false,
  error: undefined,
  data: undefined,
}