import BaseResponse from '@/modules/shared/services/interfaces';

export interface ProductionOrderNumberResponse {
  id: number;
  orderNumber: number;
}

export interface ProductionOrderNumberInitialStateResponse extends BaseResponse {
  data?: ProductionOrderNumberResponse[];
}

export const ProductionOrderNumberInitialState: ProductionOrderNumberInitialStateResponse = {
  loading: false,
  error: undefined,
  data: undefined,
};
