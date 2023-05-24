/**
 * @module OrderReplacementInterfaces
 */

import BaseResponse from '@/modules/shared/services/interfaces';

export interface OrderReplacementFormData {
  outCustomerId?: number;
  outSalesOrderNumberId?: number;
  inCustomerId?: number;
  inSalesOrderNumberId?: number;
}

export interface OrderReplacementResponse extends BaseResponse {
  data: {
    outProductionOrders: ProductionOrder[];
    inProductionOrders: ProductionOrder[];
  };
  form: SalesOrderReplacement[];
}

export interface ProductionOrder {
  sequence: number;
  productionOrderNumber?: number;
  materialName?: string;
  quantity1?: number;
  unitOfMeasure1?: string;
  quantity2?: number;
  unitOfMeasure2?: string;
  foreseenDelivery?: string;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
}
export interface SalesOrderReplacement {
  id: number;
  name: string;
  salesOrders: SalesOrder[];
}
