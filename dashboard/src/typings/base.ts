export interface BaseModel {
  id: number;
  creator: string;
  createdAt: number;
  updatedAt: number;
}

export interface AnyObject<T = any> {
  [key: string]: T;
}

export interface RouteItem {
  path: string;
  title?: string;
  component: any;
  order?: number;
}

export interface MenuItem {
  parent?: string;
  menuKey: string;
  menuLabel: string;
  menuIcon?: React.ReactElement;
  menuLink?: string;
  matchPath?: string;
  subMenus?: MenuItem[];
}
