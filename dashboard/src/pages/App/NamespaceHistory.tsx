import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Input, PageHeader, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import ITable from '@src/components/ITable';

import { useCapture } from '@src/hooks';
import { formatDate } from '@src/tools';
import { fetchNamespaceHistories, rollbackConfig } from '@src/services';
import { renderBreadcrumbItem, renderPopconfirm } from '@src/renders';
import { NamespaceHistoryItem, NamespaceHistoryQuery } from '@src/typings';

export interface NamespaceHistoryProps extends RouteComponentProps<Omit<NamespaceHistoryQuery, 'version'>> {}

const NamespaceHistory: FC<NamespaceHistoryProps> = ({ match }) => {
  const { t } = useTranslation();

  const [historiesState, getHistories] = useCapture<NamespaceHistoryItem[], NamespaceHistoryQuery>({
    fn: fetchNamespaceHistories,
    initialState: [],
  });

  useEffect(() => {
    const { appName, clusterName, namespaceName } = match.params;
    if (appName && clusterName && namespaceName) {
      getHistories({ appName, clusterName, namespaceName });
    }
  }, [getHistories, match.params]);

  const columns = useMemo(() => {
    const columns: ColumnProps<NamespaceHistoryItem>[] = [
      { title: 'Tag', key: 'tag', dataIndex: 'tag' },
      { title: t('table.columns.comment'), key: 'comment', dataIndex: 'comment' },
      { title: t('table.columns.createdAt'), key: 'createdAt', dataIndex: 'createdAt', width: 180, render: formatDate },
      {
        title: t('table.columns.control'),
        key: 'control',
        width: 100,
        render: (_, item) =>
          item.type === 'rollback' ? (
            <span style={{ cursor: 'not-allowed' }}> </span>
          ) : (
            renderPopconfirm({
              label: t('table.columns.control.rollback'),
              popLabel: t('table.columns.control.rollback.confirm'),
              popProps: {
                onConfirm: () =>
                  rollbackConfig({
                    appName: item.appName,
                    clusterName: item.clusterName,
                    namespaceName: item.namespaceName,
                    tag: item.tag,
                  })
                    .then(() => {
                      message.success(t('table.columns.control.rollback.success'));
                      getHistories((state) => ({ ...state }));
                    })
                    .catch((err) => message.error(t('table.columns.control.rollback.failure') + ': ' + err.message)),
              },
            })
          ),
      },
    ];
    return columns;
  }, [getHistories, t]);

  const onFilterKey = useCallback((key: string, item: NamespaceHistoryItem) => {
    return item.tag.includes(key);
  }, []);

  const { appName, clusterName, namespaceName } = match.params;
  return (
    <div>
      <PageHeader
        title={t('card.namespace.title') + `: ${appName}/${clusterName}/${namespaceName}`}
        ghost={false}
        breadcrumb={{
          routes: [
            { path: '/apps', breadcrumbName: t('menus.apps') },
            { path: `/apps/${appName}`, breadcrumbName: appName },
            { path: `/apps/${appName}/${clusterName}`, breadcrumbName: clusterName },
            { path: `/apps/${appName}/${clusterName}/${namespaceName}/histories`, breadcrumbName: namespaceName },
          ],
          itemRender: renderBreadcrumbItem,
        }}
      />
      <Card className="containerLayout">
        <ITable<NamespaceHistoryItem>
          rowKey="id"
          bordered={false}
          pagination={false}
          columns={columns}
          loading={historiesState.loading}
          dataSource={historiesState.data}
          showSearch={{ onFilter: onFilterKey }}
          expandedRowRender={(namespace) => <Input.TextArea value={namespace.value} readOnly />}
        />
      </Card>
    </div>
  );
};

export default NamespaceHistory;
