import React, { FC, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Card } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import ITable from '@src/components/ITable';

import { formatDate } from '@src/tools';
import { useCapture } from '@src/hooks';
import { fetchApps } from '@src/services';
import { App } from '@src/typings';

export interface AppsProps extends RouteComponentProps {}

const Apps: FC<AppsProps> = () => {
  const [key, setKey] = useState<string>('');
  const [appsState] = useCapture<App[], any>({ fn: fetchApps, initialArgs: {}, initialState: [], immediately: true });

  const columns: ColumnProps<App>[] = [
    {
      title: '应用',
      key: 'appName',
      dataIndex: 'appName',
      render: (appName, _) => <Link to={`/apps/${_.id}`}>{appName}</Link>,
    },
    { title: '创建人', key: 'creator', dataIndex: 'creator' },
    { title: '创建时间', key: 'createdAt', dataIndex: 'createdAt', width: 160, render: formatDate },
    { title: '更新时间', key: 'updatedAt', dataIndex: 'updatedAt', width: 160, render: formatDate },
    { title: '操作', key: 'control' },
  ];

  return (
    <Card title="我的应用" className="containerLayout">
      <ITable
        showSearch={{ value: key, onChange: setKey }}
        columns={columns}
        dataSource={appsState.data}
        loading={appsState.loading}
      />
    </Card>
  );
};

export default Apps;
