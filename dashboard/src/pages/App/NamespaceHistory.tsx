import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, PageHeader } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import ITable from '@src/components/ITable';

import { useCapture } from '@src/hooks';
import { formatDate } from '@src/tools';
import { fetchNamespaceHistories } from '@src/services';
import { renderBreadcrumbItem, renderPopconfirm } from '@src/renders';
import { NamespaceHistoryItem, NamespaceHistoryQuery } from '@src/typings';

export interface NamespaceHistoryProps extends RouteComponentProps<Omit<NamespaceHistoryQuery, 'version'>> {}

const NamespaceHistory: FC<NamespaceHistoryProps> = ({ match }) => {
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
      { title: '说明', key: 'comment', dataIndex: 'comment' },
      { title: '创建时间', key: 'createdAt', dataIndex: 'createdAt', width: 180, render: formatDate },
      {
        title: '操作',
        key: 'control',
        width: 100,
        render: () => renderPopconfirm({ label: '回滚', popLabel: '确认回滚' }),
      },
    ];
    return columns;
  }, []);

  const onFilterKey = useCallback((key: string, item: NamespaceHistoryItem) => {
    return item.tag.includes(key);
  }, []);

  const { appName, clusterName, namespaceName } = match.params;
  return (
    <div>
      <PageHeader
        title={`命名空间配置: ${appName}/${clusterName}/${namespaceName}`}
        ghost={false}
        breadcrumb={{
          routes: [
            { path: '/apps', breadcrumbName: '应用列表' },
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
        />
      </Card>
    </div>
  );
};

export default NamespaceHistory;
