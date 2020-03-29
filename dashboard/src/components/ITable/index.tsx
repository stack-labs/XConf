import React, { FC } from 'react';
import { TableProps } from 'antd/lib/table';
import { Button, Input, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { usePropsValue } from '@src/hooks/usePropsValue';

interface SearchOption {
  value?: string;
  onChange?: (value: string) => void;
}

export interface ITableProps<T = any> extends TableProps<T> {
  onCreate?: () => void;
  showSearch?: SearchOption;
}

const ITable: FC<ITableProps> = ({ onCreate, showSearch, ...props }) => {
  const [key, setKey] = usePropsValue<string>({ value: showSearch?.value, onChange: showSearch?.onChange });

  return (
    <>
      <div className="clear-float">
        {!!showSearch && (
          <div style={{ float: 'left', marginBottom: 16 }}>
            <label>关键字过滤: </label>
            <Input
              value={key}
              onChange={e => setKey(e.target.value)}
              style={{ marginLeft: 12, width: 300 }}
              placeholder="输入关键字过滤"
            />
          </div>
        )}
        {!!onCreate && (
          <div style={{ float: 'right', marginBottom: 16 }}>
            <Button icon={<PlusOutlined />} type="primary" onClick={onCreate}>
              创建新应用
            </Button>
          </div>
        )}
      </div>
      <Table rowKey="id" {...props} />
    </>
  );
};

export default ITable;
