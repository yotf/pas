/**
 * @module AuthLayout
 */

import PageGuard from '@/modules/shared/components/pageGuard/pageGuard.component';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import AuthGuardRoute from '../components/authGuardRoute';

/**
 * The component uses {@link AuthGuardRoute} to navigate the user through the app based on his JWT authorization.
 * The {@link PageGuard} component is used for redirection in case of an error.
 *
 */

const AuthLayout: FC = () => {
  return (
    <AuthGuardRoute>
      <div className='auth' data-testid='auth'>
        <PageGuard>
          <Outlet />
        </PageGuard>
      </div>
    </AuthGuardRoute>
  );
};
export default AuthLayout;
