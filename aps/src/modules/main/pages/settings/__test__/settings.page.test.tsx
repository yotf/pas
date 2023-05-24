import { setAuth } from '@/modules/auth/services/auth.service';
import { SETTINGS_PAGE } from '@/modules/main/consts/pageRouter';
import { mainRouter } from '@/modules/main/router';
import { authParam } from '@/modules/shared/test-config/helpers/authToken';
import {
  jwtDecodeObject,
  jwtDecodeObjectUser,
} from '@/modules/shared/test-config/helpers/jwt-decode-mock';
import { preloadedState } from '@/modules/shared/test-config/helpers/consts/preloadedStates';
import { renderWrapper } from '@/modules/shared/test-config/renderWrapper';
import { screen, waitFor } from '@testing-library/react';

afterEach(() => {
  vi.clearAllMocks();
});

test('Settings page rendered', async () => {
  vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObject) }));
  setAuth(authParam);
  renderWrapper(preloadedState, {
    extraRoutes: [mainRouter],
    goToUrl: SETTINGS_PAGE,
  });
  await waitFor(() => screen.getByTestId('settings-page'));
});

test('Settings page rendered without', async () => {
  vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObjectUser) }));
  renderWrapper(
    {},
    {
      extraRoutes: [mainRouter],
      goToUrl: SETTINGS_PAGE,
    },
  );
  await waitFor(() => screen.getByTestId('not-found-page'));
});
