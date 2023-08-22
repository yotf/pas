/**
 * @module OverviewState
 */
import { OverviewResponse } from './interfaces';
import { OverviewColumnResponse } from './interfaces';
/**
 * Overview Initial state used in {@link OverviewSlice}
 */
export const initialOverviewState: OverviewResponse = {
  data: [],
  loading: true,
  error: undefined,
};

export const initialColumnsConfigState: OverviewColumnResponse = {
  data: [],
  loading: true,
  error: undefined,
};
