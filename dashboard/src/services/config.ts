import IFetch from '@src/utils/request';

const _ = new IFetch('/admin/api/v1');

export const fetchConfigs = () => {
  return _.get('/configs');
};
