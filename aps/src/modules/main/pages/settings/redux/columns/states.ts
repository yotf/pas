import BaseResponse from '@/modules/shared/services/interfaces';
import { ColumnVisible } from '../../../columns/interfaces';

export interface ColumnConfigResponse extends BaseResponse {
  data: ColumnVisible[];
}

export const initialColumnsConfigState: ColumnConfigResponse = {
  loading: true,
  error: undefined,
  data: [],
};
