/**
 * @module useSideMenu
 */

import routes from '@/modules/main/router/routes';
import { useAppSelector } from '@/store/hooks';
import { MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { matchRoutes, NavLink, useLocation } from 'react-router-dom';
import { useTranslate } from '../../hooks/translate.hook';

export interface UseSiteMenuType {
  sideMenu: boolean;
  activeRoutes: string;
  menuItems: ItemType[];
}
/** Controls side menu behaviour
 * @returns Menu items, active route and is side menu open
 */
export const useSideMenu = (): UseSiteMenuType => {
  const { sideMenu } = useAppSelector((state) => state.sideMenu);
  const { translate } = useTranslate({
    ns: 'side_menu',
  });
  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location);
  const routeList = matchedRoutes?.map((r) => r.route) ?? [];
  const activeRoutes = `/${routeList[0]?.name}`;
  const menuItems: MenuProps['items'] = routes.map((route) => ({
    label: (
      <NavLink data-testid={route.name} to={route.path!}>
        {translate(route.name)}
      </NavLink>
    ),
    key: route.path,
    type: 'group',
  }));
  return {
    sideMenu,
    activeRoutes,
    menuItems,
  };
};
