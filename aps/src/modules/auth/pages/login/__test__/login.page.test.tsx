import { LOGIN_PAGE } from '@/modules/auth/consts/pageRoutes';
import { LoginResponse } from '@/modules/auth/redux/interfaces';
import { MAIN_LAYOUT } from '@/modules/main/consts/pageRouter';
import { jwtDecodeObject } from '@/modules/shared/test-config/helpers/jwt-decode-mock';
import { renderWrapper } from '@/modules/shared/test-config/renderWrapper';
import axiosInstance from '@/services/setup/api';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Outlet, RouteObject } from 'react-router-dom';

vi.mock('jwt-decode', () => ({ default: vi.fn(() => jwtDecodeObject) }));

const mainTestId = 'main';
const routers: RouteObject = {
  path: MAIN_LAYOUT,
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <div data-testid={mainTestId}>Test</div>,
    },
  ],
};

const expected: LoginResponse = {
  token: 'token',
  loading: false,
  error: undefined,
};

const setUsernamePassword = (username: string | null = null, pass: string | null = null) => {
  const inputs = screen.getAllByTestId('input');
  act(() => {
    fireEvent.change(inputs[0], {
      target: {
        value: username,
      },
    });
    fireEvent.change(inputs[1], {
      target: {
        value: pass,
      },
    });
  });
};

const initSetup = (username: string | null = null, pass: string | null = null) => {
  renderWrapper({}, { goToUrl: LOGIN_PAGE, extraRoutes: [routers] });
  if (username || pass) {
    setUsernamePassword(username, pass);
  }
};

const submitForm = async (): Promise<HTMLButtonElement> => {
  const submitButton = await screen.getByRole('button');
  fireEvent.submit(submitButton);
  return submitButton as HTMLButtonElement;
};

describe('Login page', () => {
  it('button is disabled by init', async () => {
    initSetup();
    const submitButton = await submitForm();
    expect(submitButton.disabled).toBeTruthy();
  });

  it('button is disabled with not enought pass length', async () => {
    initSetup('test', 'test');
    const submitButton = await submitForm();
    expect(submitButton.disabled).toBeTruthy();
  });

  it('button is disabled without username', async () => {
    initSetup(null, 'test');
    const submitButton = await submitForm();
    expect(submitButton.disabled).toBeTruthy();
  });

  it('button is disabled without password', async () => {
    initSetup('test', null);
    const submitButton = await submitForm();
    expect(submitButton.disabled).toBeTruthy();
  });

  it('submit valid form', async () => {
    vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce({
      data: expected,
    });
    initSetup('someUser', 'somePassword');
    await submitForm();
    await waitFor(() => {
      expect(screen.getByTestId('main')).toBeInTheDocument();
    });
  });

  it('submit valid form rejected', async () => {
    vi.spyOn(axiosInstance, 'post').mockRejectedValueOnce(() =>
      Promise.reject(new Error('Test message')),
    );
    initSetup('someUser', 'somePassword');
    await submitForm();
    const notification = await waitFor(() => screen.getByTestId('notification'));
    expect(notification).toBeInTheDocument();
  });
});
