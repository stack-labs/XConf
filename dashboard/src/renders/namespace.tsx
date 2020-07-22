import React from 'react';
import { TFunction } from 'i18next';
import { Namespace } from '@src/typings';

export const renderNamespaceRelease = (namespace: Namespace, t: TFunction) => {
  const { label, color } = namespace.released
    ? { label: t('label.released'), color: '#1890ff' }
    : { label: t('label.unreleased'), color: 'red' };
  return <strong style={{ color }}>{label}</strong>;
};
