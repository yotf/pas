/**
 * @module AllowedOperationsInterfaces
 */

import BaseResponse from '@/modules/shared/services/interfaces';
import { ChangeHistoryDto } from '../change-history.dto';
import { Operation } from '../operations/interfaces';

export interface AllowedOperation {
  changeHistoryDto?: ChangeHistoryDto;
  operation: Operation;
  id: number;
  operationId: number;
  workCenter: null;
  workCenterId: number;
  guid?: string;
}
export interface AllowedOperationsResponse extends BaseResponse {
  /** All operations assigned to the selected work center */
  dataByCenter: AllowedOperation[];
  /** All operations filtered by allocation  */
  dataByAllocation: Operation[];
}

export interface AllowedOperationMapped {
  id: number | string;
  code: number;
  operation: string;
  guid?: string;
}
