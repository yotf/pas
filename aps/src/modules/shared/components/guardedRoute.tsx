/**
 * @module GuardedRoute
 */

import { getRole } from '@/modules/auth/services/auth.service';
import { useAppSelector } from '@/store/hooks';
import { FC } from 'react';
import NotFoundPage from '../pages/notFound/notFound.page';
export interface GuardedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}
/**
 *
 * @param children Elements to be rendered inside the route
 * @param allowedRoles Roles that can access part of application that is being guarder (children)
 * @returns Children if the user is authorized, else {@link NotFoundPage}
 */
const GuardedRoute: FC<GuardedRouteProps> = ({ children, allowedRoles }) => {
  const { token } = useAppSelector((state) => state.auth);

  return token && allowedRoles.includes(getRole() as string) ? children : <NotFoundPage />;
};

export default GuardedRoute;
