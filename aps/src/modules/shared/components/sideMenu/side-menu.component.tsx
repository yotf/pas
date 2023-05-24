/**
 * @module SideMenu
 */

import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';
import { useSideMenu } from './side-menu.hook';
import './side-menu.scss';
/**
 *
 * @returns Side menu component. Uses {@link useSideMenu} hook to render routes and control side menu behaviour.
 */
const SideMenu: React.FC = () => {
  const { sideMenu, activeRoutes, menuItems } = useSideMenu();
  return (
    <Layout data-testid='side-menu' className='side-menu'>
      <Layout.Sider
        className={'side-menu-slider'}
        collapsed={!sideMenu}
        collapsedWidth={'0'}
        collapsible={true}
      >
        <Menu theme='dark' selectedKeys={[activeRoutes]} items={menuItems} />
      </Layout.Sider>
    </Layout>
  );
};

export default SideMenu;
