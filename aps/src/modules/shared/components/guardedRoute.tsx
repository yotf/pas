/**
 * @module GuardedRoute
 */

import { getRole } from '@/modules/auth/services/auth.service';
import { useAppSelector } from '@/store/hooks';
import { FC } from 'react';
import NotFoundPage from '../pages/notFound/notFound.page';
import LoginPage from '@/modules/auth/pages/login/login.page';
import { Navigate, useNavigate } from 'react-router-dom';
import { LOGIN_API } from '@/modules/auth/consts/apiUrl';
import { LOGIN_PAGE } from '@/modules/auth/consts/pageRoutes';
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
  if (!token) {

    return <Navigate to={LOGIN_PAGE} replace />

  }

  return allowedRoles.includes(getRole() as string) ? children : <NotFoundPage />;
};

export default GuardedRoute;
