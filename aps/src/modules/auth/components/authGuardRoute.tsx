/**
 * @module AuthGuardRoute
 */

import { MAIN_LAYOUT } from '@/modules/main/consts/pageRouter';
import { useAppSelector } from '@/store/hooks';
import { FC } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Navigates the user through the application depending on his authorization
 */
export interface AuthGuardRouteProps {
  children: JSX.Element;
}
const AuthGuardRoute: FC<AuthGuardRouteProps> = ({ children }) => {
  const { token } = useAppSelector((state) => state.auth);

  return !token ? children : <Navigate to={MAIN_LAYOUT} replace />;
};

export default AuthGuardRoute;
