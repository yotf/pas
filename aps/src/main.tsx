import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { setupStore } from './store';
import { Provider } from 'react-redux';
import setupInterceptors from './services/setup/setupInterceptors';
import { RouterProvider } from 'react-router-dom';
import { router } from './modules/shared/routes/setRouter';
import { setLanguage } from './localizations/i18n';
import { getLang } from './modules/shared/services/localization.service';
import Header from './modules/shared/components/header/header.component';

const store = setupStore();
setLanguage(getLang());
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Header />
      <div className='main-content'>
        <RouterProvider router={router} />
      </div>
    </Provider>
  </React.StrictMode>,
);
setupInterceptors(store);
