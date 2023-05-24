/**
 * @module AuthService
 */

import { AUTHORIZATION_KEY, NAME_KEY, ROLE_KEY } from '../redux/consts';
import { LoginResponse } from '../redux/interfaces';
import jwt_decode from 'jwt-decode';
import { JwtDecode } from '../interfaces';

/**
 * Controls users authorization credentials
 */

/**
 * @param token JWT Token
 * @returns Users name and role
 */
const decodeJwt = (token: string): JwtDecode => {
  const jwtDecoded: any = jwt_decode(token);
  let res = {};
  Object.keys(jwtDecoded).forEach(function (key) {
    const spitProperty: string[] = key.split('/claims/');
    const splitPropetyLenth: number = spitProperty.length;
    res = {
      ...res,
      [splitPropetyLenth == 1 ? key : spitProperty[splitPropetyLenth - 1]]: jwtDecoded[key],
    };
  });
  return res as JwtDecode;
};
/**
 *
 * @param auth API response containing JWT
 * Places extracted role and name in local storage
 */
export const setAuth = (auth: LoginResponse): void => {
  const jwtDecoded: JwtDecode = decodeJwt(auth.token!);
  localStorage.setItem(AUTHORIZATION_KEY, auth.token!);
  if (jwtDecoded.role) {
    localStorage.setItem(ROLE_KEY, jwtDecoded.role);
  }
  if (jwtDecoded.name) {
    localStorage.setItem(NAME_KEY, jwtDecoded.name);
  }
};
/**
 *
 * @param token JWT
 * Places or removes JWT from local storage
 */
export const setJwt = (token: string | null): void => {
  if (token) {
    localStorage.setItem(AUTHORIZATION_KEY, token);
  } else {
    localStorage.removeItem(AUTHORIZATION_KEY);
  }
};
/**
 *
 * @returns If user is already authenticated via JWT
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTHORIZATION_KEY);
};
/**
 *
 * @returns user's JWT
 */
export const getJwt = (): string | null => {
  return localStorage.getItem(AUTHORIZATION_KEY);
};
/**
 *
 * @returns user's role
 */
export const getRole = (): string | null => {
  return localStorage.getItem(ROLE_KEY);
};
/**
 *
 * @returns user's name
 */
export const getName = (): string | null => {
  return localStorage.getItem(NAME_KEY);
};
/**
 * removes user's authorization information from local storage
 */
export const logout = (): void => {
  localStorage.removeItem(AUTHORIZATION_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
  // window.location.replace('/login');
};
