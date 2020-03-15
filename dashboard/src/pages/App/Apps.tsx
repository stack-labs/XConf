import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface AppsProps extends RouteComponentProps {}

const Apps: FC<AppsProps> = () => {
  return <div>Apps</div>;
};

export default Apps;
