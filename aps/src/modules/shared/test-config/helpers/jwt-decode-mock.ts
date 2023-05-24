/**@module JWTTestMocks */
import { ROLE_ADMINISTRATOR, ROLE_USER } from '../../consts/roles';
/**JWT mock for role of administrator */
export const jwtDecodeObject = {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'Admin',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier':
    '03454591-29d5-41ed-817e-f69c96ac3f51',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ROLE_ADMINISTRATOR,
  exp: 1667363860,
  iss: 'http://webapiplaning.helveticode.ch/',
  aud: 'http://webapiplaning.helveticode.ch/',
};
/**JWT mock for role user */
export const jwtDecodeObjectUser = {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'User',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier':
    '03454591-29d5-41ed-817e-f69c96ac3f51',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ROLE_USER,
  exp: 1667363860,
  iss: 'http://webapiplaning.helveticode.ch/',
  aud: 'http://webapiplaning.helveticode.ch/',
};
