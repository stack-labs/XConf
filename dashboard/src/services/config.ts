import IFetch from '@src/utils/request';

const _ = new IFetch('/admin/api/v1');

export const fetchConfigs = () => {
  return _.get('/configs');
};

export interface ConfigSave {
  appName: string;
  clusterName: string;
  namespaceName: string;
  format: string;
  value: string;
}

export const saveConfig = (data: ConfigSave) => {
  return _.post('/config', data);
};

export interface ReleaseForm {
  appName: string;
  clusterName: string;
  namespaceName: string;
  tag: string;
  comment?: string;
}

export const releaseConfig = (data: ReleaseForm) => {
  return _.post('/release', data);
};

export const rollbackConfig = (data: ReleaseForm) => {
  return _.post('/rollback', data);
};
