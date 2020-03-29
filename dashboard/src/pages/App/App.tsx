import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface AppProps extends RouteComponentProps<any> {}

const App: FC<AppProps> = () => {
  return <div></div>;
};

export default App;
