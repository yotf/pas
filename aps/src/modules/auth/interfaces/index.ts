/**
 * @module AuthJwt
 */

export interface JwtDecode {
  /**
   * User' Role extracted from the JWT token
   */
  role: string;
  /**
   * name - User's Name extracted from the JWT token
   */
  name: string;
}
