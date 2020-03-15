import React, { FC } from 'react';
import { Spin } from 'antd';

export interface LoadingProps {}

const Loading: FC<LoadingProps> = () => {
  return (
    <div style={{ minHeight: 300, width: '100%', textAlign: 'center' }}>
      <Spin spinning tip="努力加载中捏. 💪" />
    </div>
  );
};

export default Loading;
