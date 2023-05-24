/**
 * @module AuthUrls
 */

/**
 * API routes for user authentication
 */
export const BASE_AUTH_API = 'userauthentication';
export const LOGIN_API = `${BASE_AUTH_API}/login`;
export const REFRESH_TOKEN_API = `${BASE_AUTH_API}/refreshToken?token=`;
