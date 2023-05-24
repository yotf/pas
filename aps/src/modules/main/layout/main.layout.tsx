/**
 * @module MainLayout
 */

import GuardedRoute from '@/modules/shared/components/guardedRoute';
import { toggleMenu } from '@/modules/shared/components/header/redux/slices';
import PageGuard from '@/modules/shared/components/pageGuard/pageGuard.component';
import SideMenu from '@/modules/shared/components/sideMenu/side-menu.component';
import { ROLE_ADMINISTRATOR, ROLE_USER } from '@/modules/shared/consts/roles';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { PayloadAction } from '@reduxjs/toolkit';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './main.layout.scss';
/**
 *
 * @returns Application Layout with the {@link SideMenu} and main router. Uses {@link GuardedRoute} and {@link PageGuard} for user authorization.
 * Controls which page is currently rendered based on side menu link selection.
 */
const MainLayout: FC = () => {
  const dispatch = useAppDispatch();
  const { sideMenu } = useAppSelector((state) => state.sideMenu);
  return (
    <GuardedRoute allowedRoles={[ROLE_USER, ROLE_ADMINISTRATOR]}>
      <div className='main-layout' data-testid='main-layout'>
        <SideMenu />
        <div className='main-layout-container'>
          <PageGuard>
            <Outlet />
          </PageGuard>
        </div>
        <div
          aria-hidden='true'
          className={`over${sideMenu ? ' show' : ''}`}
          onClick={(): PayloadAction => dispatch(toggleMenu())}
        ></div>
      </div>
    </GuardedRoute>
  );
};
export default MainLayout;
