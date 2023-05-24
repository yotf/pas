import { LOGIN_PAGE } from '@/modules/auth/consts/pageRoutes';
import { MAIN_LAYOUT } from '@/modules/main/consts/pageRouter';
import { renderWrapper } from '@/modules/shared/test-config/renderWrapper';
import { screen } from '@testing-library/react';
import { Outlet, RouteObject } from 'react-router-dom';
import SideMenu from '../side-menu.component';

const extraRouter: RouteObject = {
  path: MAIN_LAYOUT,
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <SideMenu />,
    },
  ],
};

const sidemenu = 'side-menu';

test('Side menu is shown on main layouts', () => {
  renderWrapper({}, { extraRoutes: [extraRouter], goToUrl: MAIN_LAYOUT });
  const sideMenu = screen.getByTestId(sidemenu);
  expect(sideMenu).toBeInTheDocument();
});

test('Side menu is hidden on 404 pages', () => {
  renderWrapper({}, { extraRoutes: [], goToUrl: 'doesntExist' });
  const sideMenu = screen.queryByTestId(sidemenu);
  expect(sideMenu).not.toBeInTheDocument();
});

test('Side menu is hidden on login page', () => {
  renderWrapper({}, { extraRoutes: [], goToUrl: LOGIN_PAGE });
  const sideMenu = screen.queryByTestId(sidemenu);
  expect(sideMenu).not.toBeInTheDocument();
});
