/**@module ValidationError */

/**Error extracted from a redux state. Indicates that a property entered by the user in a form is not unique */
export interface ValidationError {
  /**Property whose value is not unique */
  code: string;
  /**Text of the error message */
  description: string;
}
