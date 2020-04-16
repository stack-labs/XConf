import React, { Suspense, useMemo } from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import ZH_CN from 'antd/es/locale/zh_CN';
import { getMenus, getRoutes } from '@src/pages';

import AppLayout from '@src/AppLayout';
import Loading from '@src/components/Loading';

function App() {
  const menus = useMemo(getMenus, []);
  const routes = useMemo(getRoutes, []);

  return (
    <ConfigProvider locale={ZH_CN}>
      <Router basename="/">
        <AppLayout menus={menus}>
          <Suspense fallback={<Loading />}>
            <Switch>
              {routes.map((r) => (
                <Route key={r.path} exact path={r.path} component={r.component} />
              ))}
              <Redirect to="/apps" />
            </Switch>
          </Suspense>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
