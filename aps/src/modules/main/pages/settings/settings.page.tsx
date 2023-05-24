/**
 * @module SettingsPageOutlet
 */

import NotFoundPage from '@/modules/shared/pages/notFound/notFound.page';
import { isUserNotAdmin } from '@/modules/shared/utils/utils';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { SettingsNav } from '../../../shared/components/settings_nav/settingsNav.component';
import { SETTINGS_USERS } from './consts/pageRoutes';
import './settings.scss';

const SettingsPage: FC = () => {
  return location.pathname === `${SETTINGS_USERS}` && isUserNotAdmin() ? (
    <NotFoundPage />
  ) : (
    <div className='settings-page' data-testid='settings-page'>
      <SettingsNav />
      <div className='outlet'>
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
