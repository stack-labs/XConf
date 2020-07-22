import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
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

const getFunction = (namespace: Namespace, t: TFunction, callback: () => void) => {
  const uploadConfig = (content: string) => {
    saveConfig({
      appName: namespace.appName,
      clusterName: namespace.clusterName,
      namespaceName: namespace.namespaceName,
      format: namespace.format,
      value: content,
    })
      .then(() => {
        message.success(t('table.columns.control.import.success'));
        callback();
      })
      .catch((e) => message.error(t('table.columns.control.import.failure') + `: ${e.message}`));
  };

  const getContent = (file: File) => {
    readFile(file, (value) => {
      const [res, msg] = validateFormat(value, namespace.format, t);
      if (res) uploadConfig(value);
      else message.error(t('table.columns.control.import.failure') + `: ${msg}`);
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
  const { t } = useTranslation();

  const [, getCluster] = useCapture<ClusterType, ClusterQuery>({
    fn: fetchCluster,
    initialState: { ...defaultBaseModel, appName: '', clusterName: '' },
  });
  const [namespacesState, getNamespaces] = useCapture<Namespace[], NamespacesQuery>({
    fn: fetchNamespaces,
    initialState: [],
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  useEffect(() => {
    if (appName && clusterName) {
      getCluster({ appName, clusterName });
      getNamespaces({ appName, clusterName });
    }
  }, [appName, clusterName, getCluster, getNamespaces]);

  const columns = useMemo(() => {
    const columns: ColumnProps<Namespace>[] = [
      { title: t('table.columns.namespace'), key: 'namespaceName', dataIndex: 'namespaceName' },
      { title: t('table.columns.desc'), key: 'description', dataIndex: 'description' },
      { title: t('table.columns.createdAt'), key: 'createdAt', dataIndex: 'createdAt', width: 200, render: formatDate },
      {
        title: t('table.columns.status'),
        key: 'release',
        width: 100,
        render: (_, namespace) => renderNamespaceRelease(namespace, t),
      },
      {
        title: t('table.columns.control'),
        key: 'control',
        width: 256,
        render: (_, namespace) => {
          return (
            <div>
              <button
                className="link-button"
                onClick={getFunction(namespace, t, () => getNamespaces((state) => ({ ...state })))}
              >
                {t('table.columns.control.import')}
              </button>
              <Divider type="vertical" />
              <button
                className="link-button"
                onClick={() => downloadFile(namespace.namespaceName, namespace.value, namespace.format)}
              >
                {t('table.columns.control.export')}
              </button>
              <Divider type="vertical" />
              <Link to={`/apps/${appName}/${clusterName}/${namespace.namespaceName}/histories`}>
                {t('table.columns.control.history')}
              </Link>
              <Divider type="vertical" />
              {renderDeleteWithLinkButton({
                label: t('table.columns.control.remove'),
                popLabel: t('table.columns.control.remove.confirm.namespace'),
                onDelete: () =>
                  deleteNamespace({
                    appName: namespace.appName,
                    clusterName: namespace.clusterName,
                    namespaceName: namespace.namespaceName,
                  })
                    .then(() => {
                      message.success(namespace.appName + t('table.columns.control.remove.success'));
                      getNamespaces((query) => ({ ...query }));
                    })
                    .catch((err) => message.error(t('table.columns.control.remove.failure') + ': ' + err.message)),
              })}
            </div>
          );
        },
      },
    ];
    return columns;
  }, [appName, clusterName, getNamespaces, t]);

  const onFilterKey = useCallback((key: string, item: Namespace) => {
    return item.namespaceName.includes(key);
  }, []);

  return (
    <Card title={t('card.cluster.title') + `: ${clusterName}`} className="containerLayout">
      <ITable<Namespace>
        rowKey="id"
        bordered={false}
        pagination={false}
        columns={columns}
        loading={namespacesState.loading}
        dataSource={namespacesState.data}
        showSearch={{ onFilter: onFilterKey }}
        showCreate={{
          label: t('card.namespace.create'),
          onCreate: () =>
            NamespaceCreate({
              appName,
              clusterName,
              title: t('card.namespace.create'),
              onOk: () => getNamespaces((state) => ({ ...state, version: (state.version ?? 0) + 1 })),
            }),
        }}
        expandable={{
          expandedRowKeys,
          expandRowByClick: true,
          onExpand: (expanded, row) => setExpandedRowKeys(expanded ? [row.id] : []),
          expandedRowRender: (namespace) => (
            <NamespaceInfo canControl namespace={namespace} callback={() => getNamespaces((state) => ({ ...state }))} />
          ),
        }}
      />
    </Card>
  );
};

export default Cluster;
