import { setAuth } from '@/modules/auth/services/auth.service';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import { screen } from '@testing-library/react';
import { FC } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import { ROLE_ADMINISTRATOR, ROLE_USER } from '../../consts/roles';
import { authParam } from '../../test-config/helpers/authToken';
import { DummyPage, testPageText } from '../../test-config/helpers/components/dummy.component';
import { preloadedState } from '../../test-config/helpers/consts/preloadedStates';
import { jwtDecodeObject } from '../../test-config/helpers/jwt-decode-mock';
import GuardedRoute from '../guardedRoute';

interface RoleProps {
  roles: string[];
}

const ChildElement: FC<RoleProps> = ({ roles }) => {
  return (
    <GuardedRoute allowedRoles={roles}>
      <DummyPage />
    </GuardedRoute>
  );
};
const initPath = '/test';
const props = (roles: string[]): RouteObject[] => [
  {
    path: initPath,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ChildElement roles={roles} />,
      },
    ],
  },
];

vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObject) }));

afterEach(() => {
  localStorage.clear();
});

describe('Guarded route', () => {
  it('user is authenticated and go to allowed page', () => {
    setAuth(authParam);
    const routerOptions: RoutingOptions = {
      extraRoutes: props([ROLE_ADMINISTRATOR]),
      goToUrl: initPath,
    };
    renderWrapper(preloadedState, routerOptions);
    const content = screen.getByText(testPageText);
    expect(content).toBeInTheDocument();
  });

  it('user is authenticated and without proper role', () => {
    setAuth(authParam);
    const routerOptions: RoutingOptions = {
      extraRoutes: props([ROLE_USER]),
      goToUrl: initPath,
    };
    renderWrapper({}, routerOptions);
    const content = screen.getByTestId('not-found-page');
    expect(content).toBeInTheDocument();
  });

  it('user is not authenticated', () => {
    const routerOptions: RoutingOptions = {
      extraRoutes: props([ROLE_ADMINISTRATOR, ROLE_USER]),
      goToUrl: initPath,
    };
    renderWrapper({}, routerOptions);
    const content = screen.getByTestId('not-found-page');
    expect(content).toBeInTheDocument();
  });
});
