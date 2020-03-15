import IFetch from '@src/utils/request';

const _ = new IFetch('/admin/api/v1');

export const fetchApps = () => {
  return _.get('/apps');
};

export const createApp = () => {};

export const deleteApp = () => {};
