import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { MenuItem, RouteItem } from '@src/typings';
import { isNotEmptyArray } from '@src/tools';

interface RouteAndMenu {
  menu?: MenuItem;
  route?: RouteItem;
  sub?: RouteAndMenu[];
}

const routeAndMenuArray: RouteAndMenu[] = [
  {
    menu: { menuKey: 'app_list', menuLink: '/apps', menuLabel: '应用列表', menuIcon: <AppstoreOutlined /> },
    route: { path: '/apps', component: React.lazy(() => import('./App/Apps')) },
  },
  { route: { path: '/apps/:appID', component: React.lazy(() => import('./App/App')) } },
];

const routes: RouteItem[] = [];
const parseRouteAndMenuArray = (array: RouteAndMenu[], parent: string = ''): MenuItem[] => {
  const menus: MenuItem[] = [];
  array.forEach(item => {
    if (item.route) {
      routes.push(item.route);
      if (item.menu) item.menu.matchPath = item.route.path;
    }
    if (item.menu) {
      item.menu.parent = parent;
      menus.push(item.menu);
      if (isNotEmptyArray<MenuItem>(item.sub))
        item.menu.subMenus = parseRouteAndMenuArray(item.sub, parent + '|' + item.menu.menuKey);
    }
  });
  return menus;
};

const menus: MenuItem[] = parseRouteAndMenuArray(routeAndMenuArray);
routes.sort((a, b) => (a.order || 0) - (b.order || 0));

export const getMenus = () => menus;
export const getRoutes = () => routes;
