/**
 * @module TableSorter
 */
/**
 * @param a First value in a table column to be compared
 * @param b Seconds value in a table column to be compared
 * @returns -1 if the second value is bigger than the first, 0 if the are equal or 1 if first value is bigger than the second. If values are not numbers compares them using
 * localeCompare string method
 */
export const sorter = (a: any, b: any): number =>
  isNaN(a) && isNaN(b) ? (a || '').localeCompare(b || '') : a - b;
