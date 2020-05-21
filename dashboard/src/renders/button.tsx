import React from 'react';
import { Popconfirm } from 'antd';
import { AnyObject } from '@src/typings';
import { PopconfirmProps } from 'antd/lib/popconfirm';

export interface RenderPopconfirmProps {
  label: string;
  popLabel: string;
  popProps?: Partial<PopconfirmProps>;
}

export const renderPopconfirm = ({ label, popLabel, popProps }: RenderPopconfirmProps) => {
  return (
    <Popconfirm {...popProps} title={popLabel}>
      <button className="link-button">{label}</button>
    </Popconfirm>
  );
};

export interface RenderDeleteButtonProps {
  label: string;
  popLabel: string;
  dataSet?: AnyObject;
  onDelete: (dataset?: AnyObject) => void;
}

export const renderDeleteWithLinkButton = ({ label, popLabel, dataSet, onDelete }: RenderDeleteButtonProps) => {
  return renderPopconfirm({
    label,
    popLabel,
    popProps: { okButtonProps: { danger: true }, onConfirm: dataSet ? onDelete.bind(dataSet) : onDelete },
  });
};
