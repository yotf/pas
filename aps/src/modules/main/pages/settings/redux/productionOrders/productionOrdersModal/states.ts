/**@module ProductionOrderModalStates */
import BaseResponse from '@/modules/shared/services/interfaces';
import { ProductionOrderFormData} from '../interfaces';

export interface POModalInitialStateResponse extends BaseResponse {
  data?: ProductionOrderFormData[];
}
/** Production order modal initial state used in {@link ProductionOrderModalSlice}*/
export const POModalInitialState: POModalInitialStateResponse = {
  loading: false,
  error: undefined,
  data: undefined,
};
