import React, { FC, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Card, Divider } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import AppCreation from './AppCreate';
import ITable from '@src/components/ITable';

import { formatDate } from '@src/tools';
import { useCapture } from '@src/hooks';
import { fetchApps } from '@src/services';
import { App } from '@src/typings';
import { renderDeleteWithLinkButton } from '@src/renders';

export interface AppsProps extends RouteComponentProps {}

const Apps: FC<AppsProps> = () => {
  const [key, setKey] = useState<string>('');
  const [appsState, getApps] = useCapture<App[], { version: number }>({
    fn: fetchApps,
    initialArgs: { version: 0 },
    initialState: [],
    immediately: true,
  });

  const columns: ColumnProps<App>[] = [
    {
      title: '应用',
      key: 'appName',
      dataIndex: 'appName',
      render: (appName) => <Link to={`/apps/${appName}`}>{appName}</Link>,
    },
    { title: '描述', key: 'description', dataIndex: 'description' },
    { title: '创建人', key: 'creator', dataIndex: 'creator' },
    { title: '创建时间', key: 'createdAt', dataIndex: 'createdAt', width: 180, render: formatDate },
    { title: '更新时间', key: 'updatedAt', dataIndex: 'updatedAt', width: 180, render: formatDate },
    {
      title: '操作',
      key: 'control',
      width: 120,
      render: (_, app) => (
        <div>
          <Link to={`/apps/${app.appName}`}>查看</Link>
          <Divider type="vertical" />
          {renderDeleteWithLinkButton({
            label: '删除',
            popLabel: '确认删除应用?',
            onDelete: () => {},
          })}
        </div>
      ),
    },
  ];

  return (
    <Card title="我的应用" className="containerLayout">
      <ITable
        showSearch={{ value: key, onChange: setKey }}
        columns={columns}
        dataSource={appsState.data.filter((item) => item.appName.includes(key))}
        loading={appsState.loading}
        showCreate={{
          label: '创建新应用',
          onCreate: () =>
            AppCreation({ title: '创建新应用', onOk: () => getApps((state) => ({ version: state.version++ })) }),
        }}
      />
    </Card>
  );
};

export default Apps;
