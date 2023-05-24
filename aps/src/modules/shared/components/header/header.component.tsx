/**
 * @module Header
 */

import huniLogo from '@/assets/huni-logo.svg';
import close from '@/assets/icons/close-white.png';
import hamburger from '@/assets/icons/hamburger-white.png';
import logoutIcon from '@/assets/icons/log-out.svg';
import profileIcon from '@/assets/icons/user.svg';
import { LOGIN_PAGE } from '@/modules/auth/consts/pageRoutes';
import { logoutAction } from '@/modules/auth/redux/slices';
import { getJwt, getName, isAuthenticated } from '@/modules/auth/services/auth.service';
import { MAIN_LAYOUT } from '@/modules/main/consts/pageRouter';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { PayloadAction } from '@reduxjs/toolkit';
import { FC } from 'react';
import { router } from '../../routes/setRouter';
import './header.scss';
import { toggleMenu } from './redux/slices';
/** Header component around main layout*/
const Header: FC = () => {
  const { sideMenu } = useAppSelector((state) => state.sideMenu);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const logout = (): void => {
    dispatch(logoutAction());
    router.navigate(LOGIN_PAGE);
  };

  return (
    <div className='header'>
      <div className='logo-burger'>
        {token ? (
          <img
            onClick={(): PayloadAction => dispatch(toggleMenu())}
            className='hamburger'
            src={sideMenu ? close : hamburger}
            alt='hamburger'
            role='presentation'
          />
        ) : null}
        <img
          className={`logo ${token && 'home-page'}`}
          src={huniLogo}
          alt='logo'
          {...(token && { onClick: () => router.navigate(MAIN_LAYOUT) })}
        />
      </div>
      <div className='user-details'>
        {getJwt() && (
          <div>
            <img src={profileIcon} alt='' />
            <span>{getName()}</span>
          </div>
        )}
        {isAuthenticated() && (
          <img role='presentation' className='logout' src={logoutIcon} onClick={logout} alt='' />
        )}
      </div>
    </div>
  );
};

export default Header;
