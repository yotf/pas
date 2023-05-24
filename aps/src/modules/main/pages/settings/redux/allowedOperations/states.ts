/**
 * @module AllowedOperationsState
 */

import { AllowedOperationsResponse } from './interfaces';
/**
 * Initial state for {@link AllowedOperationsSlice}
 */
export const initialAllowedOperationsResponse: AllowedOperationsResponse = {
  loading: true,
  error: undefined,
  dataByCenter: [],
  dataByAllocation: [],
};
