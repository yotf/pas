/**@module RenderWrapperTestHelper */
import type { PreloadedState } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AppStore, rootReducer, RootState } from '@/store';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { authRouter } from '../../auth/router';

/**This type interface extends the default options for render from RTL, as well
as allows the user to specify other things such as initialState, store. */
export interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export interface RoutingOptions {
  extraRoutes?: RouteObject[];
  goToUrl?: string | undefined;
}
/** @returns A wrapper which allows rendering of components which use routing or redux */
export function renderWrapper(
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
  { extraRoutes = [], goToUrl = undefined }: RoutingOptions,
): any {
  const baseRouters = [authRouter];
  const router = createBrowserRouter([...baseRouters, ...extraRoutes]);
  if (goToUrl) {
    router.navigate(goToUrl);
  }
  function Wrapper(): JSX.Element {
    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(<></>, { wrapper: Wrapper, ...renderOptions }) };
}
