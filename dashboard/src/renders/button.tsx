import React from 'react';
import { AnyObject } from '@src/typings';
import { Popconfirm } from 'antd';

export const renderPopconfirm = () => {};

export interface RenderDeleteButtonProps {
  label: string;
  popLabel: string;
  dataSet?: AnyObject;
  onDelete: (dataset?: AnyObject) => void;
}

export const renderDeleteWithLinkButton = ({ label, popLabel, dataSet, onDelete }: RenderDeleteButtonProps) => {
  return (
    <Popconfirm
      title={popLabel}
      okButtonProps={{ type: 'danger' }}
      onConfirm={dataSet ? onDelete.bind(dataSet) : onDelete}
    >
      <button className="link-button">{label}</button>
    </Popconfirm>
  );
};
