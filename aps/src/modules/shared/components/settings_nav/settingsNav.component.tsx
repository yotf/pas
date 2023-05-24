/**
 * @module SettingsNavigation
 */

import { sharedRoutes } from '@/modules/main/router/settings.routes';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslate } from '../../hooks/translate.hook';
import './settingsNav.scss';
/**
 *
 * @returns Settings Pages Navigation links. Mapped values are written at {@link SettingsRoutes}.
 */
export const SettingsNav: FC = () => {
  const { translate } = useTranslate({
    ns: 'settings_nav',
  });
  const linkStyle = 'settings-link';

  return (
    <div className='settings-nav' data-testid='settings-nav'>
      {sharedRoutes
        .filter((r) => !r.shouldDisplay || r.shouldDisplay())
        .map((route) => {
          return (
            <NavLink
              to={route.path}
              key={route.name}
              className={({ isActive }): string => `${linkStyle} ${isActive ? 'active' : ''}`}
            >
              {translate(route.name)}
            </NavLink>
          );
        })}
      <br />
    </div>
  );
};
