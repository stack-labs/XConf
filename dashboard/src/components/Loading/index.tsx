import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';

export interface LoadingProps {}

const Loading: FC<LoadingProps> = () => {
  const { t } = useTranslation();
  return (
    <div style={{ minHeight: 300, lineHeight: 300, width: '100%', textAlign: 'center' }}>
      <Spin spinning tip={t('label.loading') + ' 💪'} />
    </div>
  );
};

export default Loading;
