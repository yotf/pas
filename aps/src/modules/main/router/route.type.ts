/**
 * @module RouteType
 */

import { RouteObject } from 'react-router-dom';

export type Route = RouteObject & {
  path: string;
  name: string;
  shouldDisplay?: () => boolean;
};
