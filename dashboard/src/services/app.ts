import IFetch from '@src/utils/request';
import { App } from '@src/typings';

const _ = new IFetch('/admin/api/v1');

export const fetchApps = (): Promise<App[]> => {
  return _.get('/apps');
};

export const createApp = () => {};

export const deleteApp = () => {};
