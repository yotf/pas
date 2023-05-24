/**
 * @module PageGuard
 */

import { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';
import ErrorPage from '../../pages/error/error.page';

export interface PageGuardProps {
  children: JSX.Element;
}
/**
 *
 * @param children JSX Elements to be rendered inside the PageGuard
 * @returns Children passed to the guard if there are no errors, otherwise returns {@link ErrorPage | error page}
 */
const PageGuard: FC<PageGuardProps> = ({ children }) => {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.key} FallbackComponent={ErrorPage}>
      {children}
    </ErrorBoundary>
  );
};

export default PageGuard;
