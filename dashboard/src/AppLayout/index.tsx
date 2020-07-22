import React, { FC, useEffect, useState } from 'react';
import { Link, matchPath, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Menu, Select } from 'antd';
import { GithubOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { BFS, replaceSearch, setComputerLanguage } from '@src/tools';

import { MenuItem } from '@src/typings';
import styles from './index.module.scss';
import { languages } from '@src/i18n';

const renderMenuItem = (menuItem: MenuItem): React.ReactElement => {
  const renderLabel = () => {
    const link = menuItem.menuLink;
    return link ? (
      link.startsWith('http') ? (
        <a className={styles.menuItem} href={link} target="_blank" rel="noopener noreferrer">
          {menuItem.menuIcon}
          <span>{menuItem.menuLabel}</span>
        </a>
      ) : (
        <Link className={styles.menuItem} to={link}>
          {menuItem.menuIcon}
          <span>{menuItem.menuLabel}</span>
        </Link>
      )
    ) : (
      <span className={styles.menuItem}>
        {menuItem.menuIcon}
        <span>{menuItem.menuLabel}</span>
      </span>
    );
  };
  if (Array.isArray(menuItem.subMenus) && menuItem.subMenus.length) {
    return (
      <Menu.SubMenu key={menuItem.menuKey} title={<span>{renderLabel()}</span>} className={styles.menuItem}>
        {menuItem.subMenus.map(renderMenuItem)}
      </Menu.SubMenu>
    );
  }
  return <Menu.Item key={menuItem.menuKey}>{renderLabel()}</Menu.Item>;
};

export interface AppLayoutProps {
  language: string;
  menus: MenuItem[];
  children: React.ReactChild;
}

const AppLayout: FC<AppLayoutProps> = ({ language, menus, children }) => {
  const [collapsed, toggle] = useState<boolean>(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { t } = useTranslation();

  const history = useHistory();
  const { pathname } = useLocation();

  useEffect(() => {
    const menu = BFS<MenuItem>({
      dataSource: menus,
      isTarget: (item) => {
        if (!item.matchPath) return false;
        const match = matchPath(pathname, item.matchPath);
        return !!(match && match.isExact);
      },
    });
    setOpenKeys((arr) => {
      if (!menu?.parent || arr.includes(menu.parent)) return arr;
      const openMenus: string[] = [];
      menu.parent
        .split('|')
        .slice(0, -1)
        .reduce((p, c) => {
          const now = p ? `${p}-${c}` : c;
          openMenus.push(now);
          return now;
        }, '');
      return openMenus;
    });
    setSelectedKeys((arr) => {
      if (arr[0] === menu?.menuKey) return arr;
      return menu ? [menu.menuKey] : [];
    });
  }, [menus, pathname]);

  return (
    <Layout className={styles.layout}>
      <Layout.Sider theme="light" className={styles.sider} trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.logo}>
          <strong>XConf</strong>
          {!collapsed && <small>{t('layout.title')}</small>}
        </div>
        <Menu theme="light" mode="inline" className={styles.menus} openKeys={openKeys} selectedKeys={selectedKeys}>
          {menus.map(renderMenuItem)}
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Header className={styles.header}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: styles.trigger,
            onClick: () => toggle((prev) => !prev),
          })}
          <div className={styles.rightLayout}>
            <Select
              value={language}
              style={{ width: 100 }}
              onChange={(lang) => {
                setComputerLanguage(lang);
                replaceSearch(history, { lang });
              }}
            >
              {languages.map((l) => (
                <Select.Option key={l.lng} value={l.lng}>
                  {l.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Layout.Header>
        <Layout.Content>{children}</Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          <div>
            <span>XConf {t('layout.title')}</span>
            <GithubOutlined style={{ marginLeft: 36 }} />
          </div>
          <div>Copyright © 2020 {t('layout.ownership')}</div>
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
