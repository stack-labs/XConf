import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Collapse, PageHeader, Typography, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Route as BreadcrumbItem } from 'antd/lib/breadcrumb/Breadcrumb';

import ClusterCard from './Cluster';
import ITable from '@src/components/ITable';

import { useCapture } from '@src/hooks';
import { formatDate } from '@src/tools';
import { deleteCluster, fetchApp, fetchClusters } from '@src/services';
import { renderBreadcrumbItem, renderDeleteWithLinkButton } from '@src/renders';
import { AppQuery, App as AppType, Cluster, defaultBaseModel } from '@src/typings';
import ClusterCreate from '@src/pages/App/ClusterCreate';

export interface AppProps extends RouteComponentProps<{ appName: string; clusterName?: string }> {}

const App: FC<AppProps> = ({ match }) => {
  const { t } = useTranslation();
  const [collapseKey, setCollapseKey] = useState<string>('clusters');
  const [appName, setAppName] = useState<string>('');
  const [clusterName, setClusterName] = useState<string>();

  const [appState, getApp] = useCapture<AppType, AppQuery>({
    fn: fetchApp,
    initialState: { ...defaultBaseModel, appName: '' },
  });
  const [clustersState, getClusters] = useCapture<Cluster[], AppQuery>({ fn: fetchClusters, initialState: [] });

  useEffect(() => {
    const { appName, clusterName } = match.params;
    setAppName(appName);
    if (clusterName) {
      setClusterName(clusterName);
      setCollapseKey('');
    } else {
      setClusterName('');
      setCollapseKey('clusters');
    }
  }, [match.params]);

  useEffect(() => {
    if (appName) {
      getApp({ appName });
      getClusters({ appName });
    }
  }, [appName, getApp, getClusters]);

  const columns = useMemo(() => {
    const columns: ColumnProps<Cluster>[] = [
      {
        title: t('table.columns.cluster'),
        key: 'clusterName',
        dataIndex: 'clusterName',
        render: (clusterName) => <Link to={`/apps/${appName}/${clusterName}`}>{clusterName}</Link>,
      },
      { title: t('table.columns.desc'), key: 'description', dataIndex: 'description' },
      { title: t('table.columns.createdAt'), key: 'createdAt', dataIndex: 'createdAt', width: 200, render: formatDate },
      {
        title: t('table.columns.control'),
        key: 'control',
        width: 100,
        render: (_, cluster) => {
          return renderDeleteWithLinkButton({
            label: t('table.columns.control.remove'),
            popLabel: t('table.columns.control.remove.confirm.cluster'),
            onDelete: () =>
              deleteCluster({ appName: cluster.appName, clusterName: cluster.clusterName })
                .then(() => {
                  message.success(cluster.appName + t('table.columns.control.remove.success'));
                  getClusters((query) => ({ ...query }));
                })
                .catch(message.error),
          });
        },
      },
    ];
    return columns;
  }, [appName, getClusters, t]);

  const onFilterKey = useCallback((key: string, item: Cluster) => {
    return item.clusterName.includes(key);
  }, []);

  return (
    <div>
      <PageHeader
        title={t('card.app.title') + `: ${appName}`}
        ghost={false}
        breadcrumb={{
          routes: [
            { path: '/apps', breadcrumbName: t('menus.apps') },
            appName && { path: `/apps/${appName}`, breadcrumbName: appName },
            appName && clusterName && { path: `/apps/${appName}/${clusterName}`, breadcrumbName: clusterName },
          ].filter((item) => !!item) as BreadcrumbItem[],
          itemRender: renderBreadcrumbItem,
        }}
        onBack={() => window.history.back()}
      >
        <Typography.Paragraph>{appState.data.description || t('empty.desc')}</Typography.Paragraph>
      </PageHeader>
      <Collapse
        className="containerLayout"
        accordion
        activeKey={collapseKey}
        onChange={setCollapseKey as (key: string | string[]) => void}
      >
        <Collapse.Panel key="clusters" header={t('menus.clusters')}>
          <ITable<Cluster>
            rowKey="id"
            bordered={false}
            loading={clustersState.loading}
            dataSource={clustersState.data}
            columns={columns}
            pagination={false}
            showCreate={{
              label: t('card.cluster.create'),
              onCreate: () =>
                ClusterCreate({
                  appName,
                  title: t('card.cluster.create'),
                  onOk: () => getClusters((state) => ({ ...state, version: (state.version ?? 0) + 1 })),
                }),
            }}
            showSearch={{ onFilter: onFilterKey }}
          />
        </Collapse.Panel>
      </Collapse>
      {clusterName && <ClusterCard appName={appName} clusterName={clusterName} />}
    </div>
  );
};

export default App;
