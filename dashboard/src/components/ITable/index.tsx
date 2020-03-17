import React, { FC } from 'react';
import { TableProps } from 'antd/lib/table';
import { Input, Table } from 'antd';

import { usePropsValue } from '@src/hooks/usePropsValue';

interface SearchOption {
  value?: string;
  onChange?: (value: string) => void;
}

export interface ITableProps<T = any> extends TableProps<T> {
  showSearch?: SearchOption;
}

const ITable: FC<ITableProps> = ({ showSearch = {}, ...props }) => {
  const [key, setKey] = usePropsValue<string>({ value: showSearch.value, onChange: showSearch.onChange });

  return (
    <>
      {showSearch && (
        <div>
          <label>关键字过滤: </label>
          <Input
            value={key}
            onChange={e => setKey(e.target.value)}
            style={{ marginLeft: 12, marginBottom: 16, width: 300 }}
            placeholder="输入关键字过滤"
          />
        </div>
      )}
      <Table rowKey="id" {...props} />
    </>
  );
};

export default ITable;
