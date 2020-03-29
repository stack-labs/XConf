import IFetch from '@src/utils/request';
import { App, AppCreation, AppQuery } from '@src/typings';

const _ = new IFetch('/admin/api/v1');

export const fetchApps = (): Promise<App[]> => {
  return _.get('/apps');
};

export const fetchApp = (query: AppQuery): Promise<App> => {
  return _.get('/apps', query);
};

export const createApp = (data: AppCreation) => {
  return _.post('/apps', data);
};

export const deleteApp = () => {};
