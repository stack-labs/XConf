import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { Card, Divider, Tag } from 'antd';

import { useCapture } from '@src/hooks';
import { fetchCluster, fetchNamespaces } from '@src/services';
import { ClusterQuery, Cluster as ClusterType, Namespace, NamespacesQuery, defaultBaseModel } from '@src/typings';
import ITable from '@src/components/ITable';
import { ColumnProps } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import { formatDate } from '@src/tools';
import { renderDeleteWithLinkButton } from '@src/renders';

export interface ClusterProps extends ClusterQuery {}

const Cluster: FC<ClusterProps> = ({ appName, clusterName }) => {
  // TODO: clusterState
  const [, getCluster] = useCapture<ClusterType, ClusterQuery>({
    fn: fetchCluster,
    initialState: { ...defaultBaseModel, appName: '', clusterName: '' },
  });
  const [namespacesState, getNamespaces] = useCapture<Namespace[], NamespacesQuery>({
    fn: fetchNamespaces,
    initialState: [],
  });

  useEffect(() => {
    if (appName && clusterName) {
      getCluster({ appName, clusterName });
      getNamespaces({ appName, clusterName });
    }
  }, [appName, clusterName, getCluster, getNamespaces]);

  const columns = useMemo(() => {
    const columns: ColumnProps<Namespace>[] = [
      {
        title: '空间名',
        key: 'namespaceName',
        dataIndex: 'namespaceName',
        render: namespaceName => <Link to={`/apps/${appName}/${clusterName}/${namespaceName}`}>{namespaceName}</Link>,
      },
      { title: '描述', key: 'description', dataIndex: 'description' },
      { title: '数据格式', key: 'format', dataIndex: 'format', render: format => <Tag color="#108ee9">{format}</Tag> },
      { title: '创建日期', key: 'createdAt', dataIndex: 'createdAt', width: 200, render: formatDate },
      { title: '状态', key: 'release', dataIndex: 'release', render: release => (release ? '已发布' : '未发布') },
      {
        title: '操作',
        key: 'control',
        width: 160,
        render: (_, cluster) => {
          return (
            <div>
              <Link to={`/`}>历史版本</Link>
              <Divider type="vertical" />
              {renderDeleteWithLinkButton({ label: '删除', popLabel: '确认删除空间', onDelete: () => {} })}
            </div>
          );
        },
      },
    ];
    return columns;
  }, [appName, clusterName]);

  const onFilterKey = useCallback((key: string, item: Namespace) => {
    return item.namespaceName.includes(key);
  }, []);

  return (
    <Card title={`集群: ${clusterName}`} className="containerLayout">
      <ITable<Namespace>
        rowKey="id"
        bordered={false}
        pagination={false}
        columns={columns}
        loading={namespacesState.loading}
        dataSource={namespacesState.data}
        showSearch={{ onFilter: onFilterKey }}
      />
    </Card>
  );
};

export default Cluster;
