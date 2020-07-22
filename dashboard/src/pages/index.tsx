import React from 'react';
import { TFunction } from 'i18next';
import { AppstoreOutlined, GithubFilled } from '@ant-design/icons';
import { isNotEmptyArray } from '@src/tools';
import { MenuItem, RouteItem } from '@src/typings';

interface RouteAndMenu {
  menu?: MenuItem;
  route?: RouteItem;
  sub?: RouteAndMenu[];
}

const getRouteAndMenuArray = ({ t }: { t: TFunction }): RouteAndMenu[] => [
  {
    menu: {
      menuKey: 'app_list',
      menuLink: '/apps',
      menuLabel: t('menus.apps'),
      menuIcon: <AppstoreOutlined />,
    },
    route: { path: '/apps', component: React.lazy(() => import('./App/Apps')) },
  },
  { route: { path: '/apps/:appName/:clusterName?', order: 10, component: React.lazy(() => import('./App/App')) } },
  {
    route: {
      path: '/apps/:appName/:clusterName/:namespaceName/histories',
      order: 11,
      component: React.lazy(() => import('./App/NamespaceHistory')),
    },
  },
  {
    menu: {
      menuKey: 'Github',
      menuLink: 'https://github.com/micro-in-cn/XConf',
      menuLabel: t('menus.github'),
      menuIcon: <GithubFilled />,
    },
  },
];

const parseMenu = (array: RouteAndMenu[], parent: string = ''): MenuItem[] => {
  const menus: MenuItem[] = [];
  array.forEach((item) => {
    if (item.route) {
      if (item.menu) item.menu.matchPath = item.route.path;
    }
    if (item.menu) {
      item.menu.parent = parent;
      menus.push(item.menu);
      if (isNotEmptyArray<MenuItem>(item.sub))
        item.menu.subMenus = parseMenu(item.sub, parent + '|' + item.menu.menuKey);
    }
  });
  return menus;
};

const parseRoute = (array: RouteAndMenu[]): RouteItem[] => {
  const routes: RouteItem[] = [];
  array.forEach((item) => {
    if (item.route) routes.push(item.route);
    if (item.menu && isNotEmptyArray<MenuItem>(item.sub)) {
      parseRoute(item.sub);
    }
  });
  return routes;
};

export const getMenus = (t: TFunction): MenuItem[] => {
  const menus: MenuItem[] = parseMenu(getRouteAndMenuArray({ t }));
  return menus;
};
export const getRoutes = (): RouteItem[] => {
  const routes: RouteItem[] = parseRoute(getRouteAndMenuArray({ t: (key: string) => key }));
  routes.sort((a, b) => (a.order || 0) - (b.order || 0));
  return routes;
};
