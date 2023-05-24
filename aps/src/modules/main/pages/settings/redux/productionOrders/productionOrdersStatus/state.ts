/**@module ProductionOrderStatusStates */
import BaseResponse from '@/modules/shared/services/interfaces';
/**Production order status initial state used in {@link ProductionOrderStatusSlice} */
export const initialProductionOrdersStatusState: BaseResponse = {
  loading: true,
  error: undefined,
};
