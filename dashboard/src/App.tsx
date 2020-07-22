import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { createBrowserHistory } from 'history';
import { useTranslation } from 'react-i18next';

import AppLayout from '@src/AppLayout';
import Loading from '@src/components/Loading';
import i18n, { antLocales } from '@src/i18n';
import { getMenus, getRoutes } from '@src/pages';
import { getLanguage, parseSearch } from '@src/tools';

const history = createBrowserHistory({ basename: process.env.NODE_ENV === 'production' ? '/admin/ui' : '/' });
const getLang = (search: string) => {
  const { lang } = parseSearch(search);
  return getLanguage(lang);
};

function App() {
  const [language, changeLanguage] = useState<string>(() => getLang(history.location.search));
  const { t } = useTranslation();

  const menus = useMemo(() => getMenus(t), [t]);
  const routes = useMemo(getRoutes, []);

  useEffect(() => {
    return history.listen((l) => {
      changeLanguage(getLang(l.search));
    });
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <ConfigProvider locale={antLocales[language]}>
      <Router history={history}>
        <AppLayout menus={menus} language={language}>
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
