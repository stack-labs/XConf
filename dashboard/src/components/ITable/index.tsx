import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TableProps } from 'antd/lib/table';

import { usePropsValue } from '@src/hooks/usePropsValue';

interface SearchOption<T> {
  value?: string;
  onChange?: (value: string) => void;
  onFilter?: (key: string, item: T) => boolean;
}

interface CreateOption {
  label: string;
  onCreate?: () => void;
}

export interface ITableProps<T = any> extends TableProps<T> {
  showCreate?: CreateOption;
  showSearch?: SearchOption<T>;
}

const ITable = <T extends object = any>({ showCreate, showSearch, ...props }: ITableProps<T>): JSX.Element => {
  const { t } = useTranslation();
  const [key, setKey] = usePropsValue<string>({ value: showSearch?.value, onChange: showSearch?.onChange });
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    if (showSearch?.onFilter !== undefined) {
      const data: T[] = key
        ? ((props.dataSource || []) as T[])?.filter((item) => {
            return showSearch?.onFilter && showSearch?.onFilter(key, item);
          })
        : props.dataSource || [];
      setData(data);
    }
  }, [key, props.dataSource, showSearch]);

  return (
    <>
      <div className="clear-float">
        {!!showSearch && (
          <div style={{ float: 'left', marginBottom: 16, display: 'flex', alignItems: 'center' }}>
            <label>{t('table.filter')}: </label>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              style={{ marginLeft: 12, width: 300 }}
              placeholder={t('table.filter.placeholder')}
              addonAfter={
                <span style={{ cursor: 'pointer' }} onClick={() => setKey('')}>
                  {t('table.filter_clear_button')}
                </span>
              }
            />
          </div>
        )}
        {!!showCreate && (
          <div style={{ float: 'right', marginBottom: 16 }}>
            <Button icon={<PlusOutlined />} type="primary" onClick={showCreate.onCreate}>
              {showCreate.label}
            </Button>
          </div>
        )}
      </div>
      <Table rowKey="id" {...props} dataSource={showSearch?.onFilter ? data : props.dataSource} />
    </>
  );
};

export default ITable;
