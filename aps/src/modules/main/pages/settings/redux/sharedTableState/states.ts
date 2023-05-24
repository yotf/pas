/**@module SharedTableStateStates */
export interface SharedTableStateType {
  pageNumber: number;
}
/**
 * Current pagination number used by a table on currently rendered page
 */
export const initialSharedTableState: SharedTableStateType = {
  pageNumber: 1,
};
