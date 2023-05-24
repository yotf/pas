import { AUTHORIZATION_KEY, ROLE_KEY } from '@/modules/auth/redux/consts';
import { setAuth } from '@/modules/auth/services/auth.service';
import { SETTINGS_USERS } from '@/modules/main/pages/settings/consts/pageRoutes';
import { mainRouter } from '@/modules/main/router';
import { ROLE_USER } from '@/modules/shared/consts/roles';
import { authParam } from '@/modules/shared/test-config/helpers/authToken';
import { preloadedState } from '@/modules/shared/test-config/helpers/consts/preloadedStates';
import { jwtDecodeObject } from '@/modules/shared/test-config/helpers/jwt-decode-mock';
import { renderWrapper, RoutingOptions } from '@/modules/shared/test-config/renderWrapper';
import { screen, waitFor } from '@testing-library/react';

afterEach(() => {
  vi.clearAllMocks();
});

test('Settings Navigation - Going to settings page as Administrator, all routes should be available', async () => {
  const routerOptions: RoutingOptions = {
    extraRoutes: [mainRouter],
    goToUrl: SETTINGS_USERS,
  };
  vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObject) }));
  setAuth(authParam);
  renderWrapper(preloadedState, routerOptions);
  await waitFor(() => screen.getByTestId('settings-page'));
});

test('Settings Navigation - Redirect to 404 page', async () => {
  const routerOptions: RoutingOptions = {
    extraRoutes: [mainRouter],
    goToUrl: SETTINGS_USERS,
  };
  localStorage.setItem(AUTHORIZATION_KEY, authParam.token!);
  localStorage.setItem(ROLE_KEY, ROLE_USER);
  renderWrapper({}, routerOptions);
  await waitFor(() => screen.getByTestId('not-found-page'));
});
