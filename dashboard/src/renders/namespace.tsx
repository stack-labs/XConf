import React from 'react';
import { Namespace } from '@src/typings';

export const renderNamespaceRelease = (namespace: Namespace) => {
  const { label, color } = namespace.released
    ? { label: '已发布', color: '#1890ff' }
    : { label: '未发布', color: 'red' };
  return <strong style={{ color }}>{label}</strong>;
};
