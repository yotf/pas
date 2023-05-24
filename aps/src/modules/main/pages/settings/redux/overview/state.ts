/**
 * @module OverviewState
 */
import { OverviewResponse } from './interfaces';
/**
 * Overview Initial state used in {@link OverviewSlice}
 */
export const initialOverviewState: OverviewResponse = {
  data: [],
  loading: true,
  error: undefined,
};
