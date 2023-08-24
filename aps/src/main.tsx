import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { setupStore } from './store';
import { Provider } from 'react-redux';
import setupInterceptors from './services/setup/setupInterceptors';
import { RouterProvider } from 'react-router-dom';
import { router } from './modules/shared/routes/setRouter';
//import { setLanguage } from './localizations/i18n';
import Header from './modules/shared/components/header/header.component';
import { I18nextProvider } from 'react-i18next';
import i18n from './localizations/i18n';
import { LANGUAGE_KEY } from './modules/shared/services/localization.service';

const store = setupStore();
const selectedLanguage = localStorage.getItem(LANGUAGE_KEY);
if (selectedLanguage) {
  i18n.changeLanguage(selectedLanguage);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <Header />
        <div className='main-content'>
          <RouterProvider router={router} />
        </div>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
);
setupInterceptors(store);
