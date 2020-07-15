import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Card, Divider, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';

import AppCreation from './AppCreate';
import ITable from '@src/components/ITable';

import { formatDate } from '@src/tools';
import { useCapture } from '@src/hooks';
import { deleteApp, fetchApps } from '@src/services';
import { App } from '@src/typings';
import { renderDeleteWithLinkButton } from '@src/renders';

export interface AppsProps extends RouteComponentProps {}

const Apps: FC<AppsProps> = () => {
  const [key, setKey] = useState<string>('');
  const { t } = useTranslation();
  const [appsState, getApps] = useCapture<App[], { version: number }>({
    fn: fetchApps,
    initialArgs: { version: 0 },
    initialState: [],
    immediately: true,
  });

  const columns: ColumnProps<App>[] = [
    {
      title: t('table.columns.app'),
      key: 'appName',
      dataIndex: 'appName',
      render: (appName) => <Link to={`/apps/${appName}`}>{appName}</Link>,
    },
    { title: t('table.columns.desc'), key: 'description', dataIndex: 'description' },
    { title: t('table.columns.createdAt'), key: 'createdAt', dataIndex: 'createdAt', width: 180, render: formatDate },
    { title: t('table.columns.updatedAt'), key: 'updatedAt', dataIndex: 'updatedAt', width: 180, render: formatDate },
    {
      title: t('table.columns.control'),
      key: 'control',
      width: 120,
      render: (_, app) => (
        <div>
          <Link to={`/apps/${app.appName}`}>{t('table.columns.control.view')}</Link>
          <Divider type="vertical" />
          {renderDeleteWithLinkButton({
            label: t('table.columns.control.remove'),
            popLabel: t('table.columns.control.remove.confirm.app'),
            onDelete: () =>
              deleteApp({ appName: app.appName })
                .then(() => {
                  message.success(app.appName + t('table.columns.control.remove.success'));
                  getApps((query) => ({ ...query }));
                })
                .catch(message.error),
          })}
        </div>
      ),
    },
  ];

  return (
    <Card title={t('card.app')} className="containerLayout">
      <ITable
        showSearch={{ value: key, onChange: setKey }}
        columns={columns}
        dataSource={appsState.data.filter((item) => item.appName.includes(key))}
        loading={appsState.loading}
        showCreate={{
          label: t('card.app.create'),
          onCreate: () =>
            AppCreation({
              title: t('card.app.create'),
              onOk: () => getApps((state) => ({ version: state.version++ })),
            }),
        }}
      />
    </Card>
  );
};

export default Apps;
