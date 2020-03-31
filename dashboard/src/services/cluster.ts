import IFetch from '@src/utils/request';
import { AppQuery, Cluster, ClusterQuery } from '@src/typings';

const _ = new IFetch('/admin/api/v1');

export const fetchClusters = (query: AppQuery): Promise<Cluster[]> => {
  return _.get('/clusters', query);
};

export const fetchCluster = (query: ClusterQuery): Promise<Cluster> => {
  return _.get('/clusters', query);
};
