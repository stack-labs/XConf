import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import NamespaceCreate from './NamespaceCreate';
import NamespaceInfo from './NamespaceInfo';
import { validateFormat } from '@src/components/Editor';
import ITable from '@src/components/ITable';

import { useCapture } from '@src/hooks';
import { downloadFile, formatDate, readFile, uploadFile } from '@src/tools';
import { renderDeleteWithLinkButton, renderNamespaceRelease } from '@src/renders';
import { deleteNamespace, fetchCluster, fetchNamespaces, saveConfig } from '@src/services';
import { ClusterQuery, Cluster as ClusterType, Namespace, NamespacesQuery, defaultBaseModel } from '@src/typings';

const getFunction = (namespace: Namespace, callback: () => void) => {
  const uploadConfig = (content: string) => {
    saveConfig({
      appName: namespace.appName,
      clusterName: namespace.clusterName,
      namespaceName: namespace.namespaceName,
      format: namespace.format,
      value: content,
    })
      .then(() => {
        message.success('配置保存成功');
        callback();
      })
      .catch((e) => message.error('保存失败:', e.message));
  };

  const getContent = (file: File) => {
    readFile(file, (value) => {
      const [res, msg] = validateFormat(value, namespace.format);
      if (res) uploadConfig(value);
      else message.error(`导入文件失败: ${msg}`);
    });
  };

  return () => {
    uploadFile((files) => {
      const file = files[0];
      file && getContent(file);
    }, namespace.format);
  };
};

export interface ClusterProps extends ClusterQuery {}

const Cluster: FC<ClusterProps> = ({ appName, clusterName }) => {
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
      { title: '空间名', key: 'namespaceName', dataIndex: 'namespaceName' },
      { title: '描述', key: 'description', dataIndex: 'description' },
      { title: '创建日期', key: 'createdAt', dataIndex: 'createdAt', width: 200, render: formatDate },
      { title: '状态', key: 'release', width: 100, render: (_, namespace) => renderNamespaceRelease(namespace) },
      {
        title: '操作',
        key: 'control',
        width: 230,
        render: (_, namespace) => {
          return (
            <div>
              <Link to={`/apps/${appName}/${clusterName}/${namespace.namespaceName}/histories`}>历史版本</Link>
              <Divider type="vertical" />
              <button
                className="link-button"
                onClick={getFunction(namespace, () => getNamespaces((state) => ({ ...state })))}
              >
                导入
              </button>
              <Divider type="vertical" />
              <button
                className="link-button"
                onClick={() => downloadFile(namespace.namespaceName, namespace.value, namespace.format)}
              >
                导出
              </button>
              <Divider type="vertical" />
              {renderDeleteWithLinkButton({
                label: '删除',
                popLabel: '确认删除空间',
                onDelete: () =>
                  deleteNamespace({
                    appName: namespace.appName,
                    clusterName: namespace.clusterName,
                    namespaceName: namespace.namespaceName,
                  })
                    .then(() => {
                      message.success(`删除应用 ${namespace.appName} 成功`);
                      getNamespaces((query) => ({ ...query }));
                    })
                    .catch(message.error),
              })}
            </div>
          );
        },
      },
    ];
    return columns;
  }, [appName, clusterName, getNamespaces]);

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
        showCreate={{
          label: '创建新配置',
          onCreate: () =>
            NamespaceCreate({
              appName,
              clusterName,
              title: '创建新配置',
              onOk: () => getNamespaces((state) => ({ ...state, version: (state.version ?? 0) + 1 })),
            }),
        }}
        showSearch={{ onFilter: onFilterKey }}
        expandedRowRender={(namespace) => (
          <NamespaceInfo canControl namespace={namespace} callback={() => getNamespaces((state) => ({ ...state }))} />
        )}
      />
    </Card>
  );
};

export default Cluster;
