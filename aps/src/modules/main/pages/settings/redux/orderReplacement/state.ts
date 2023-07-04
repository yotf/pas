/**
 * @module OrderReplacementState
 */

import { OrderReplacementResponse } from './interfaces';
/**
 * Order Replacement initial state. Used in {@link OrderReplacementSlice}
 */
export const initialOrderPlacementState: OrderReplacementResponse = {
  data: {
    outProductionOrders: [],
    inProductionOrders: [],
    inSalesOrders: [],
    outSalesOrders:[],
  },
  form: [],
  loading: true,
  error: undefined,
};
