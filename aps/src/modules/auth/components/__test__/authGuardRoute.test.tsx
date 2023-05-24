import {
  DummyPage,
  testPageId,
} from '@/modules/shared/test-config/helpers/components/dummy.component';
import { jwtDecodeObject } from '@/modules/shared/test-config/helpers/jwt-decode-mock';
import { Outlet, RouteObject } from 'react-router-dom';
import AuthGuardRoute from '../authGuardRoute';
import { setAuth } from '@/modules/auth/services/auth.service';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import { screen } from '@testing-library/react';
import { MAIN_LAYOUT } from '@/modules/main/consts/pageRouter';
import { authParam } from '@/modules/shared/test-config/helpers/authToken';
import { preloadedState } from '@/modules/shared/test-config/helpers/consts/preloadedStates';

afterEach(() => {
  localStorage.clear();
});

vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObject) }));

const ChildElement: React.FC = () => {
  return (
    <AuthGuardRoute>
      <DummyPage />
    </AuthGuardRoute>
  );
};

const initPath = '/test';
const mainTestId = 'main';

const routes: RouteObject[] = [
  {
    path: initPath,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ChildElement />,
      },
    ],
  },
  {
    path: MAIN_LAYOUT,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <div data-testid={mainTestId}>Test</div>,
      },
    ],
  },
];

describe('auth guard route', () => {
  it('user is authenticated and not allowed to access login page', () => {
    setAuth(authParam);
    const routerOptions: RoutingOptions = {
      extraRoutes: routes,
      goToUrl: initPath,
    };
    renderWrapper(preloadedState, routerOptions);
    const content = screen.getByTestId(mainTestId);
    expect(content).toBeInTheDocument();
  });

  it('user is not authenticated and allowed to access login page', () => {
    const routerOptions: RoutingOptions = {
      extraRoutes: routes,
      goToUrl: initPath,
    };
    renderWrapper({}, routerOptions);
    const content = screen.getByTestId(testPageId);
    expect(content).toBeInTheDocument();
  });
});
