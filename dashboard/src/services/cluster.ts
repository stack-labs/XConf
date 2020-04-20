import IFetch from '@src/utils/request';
import { AppQuery, Cluster, ClusterCreation, ClusterQuery } from '@src/typings';

const _ = new IFetch('/admin/api/v1');

export const fetchClusters = (query: AppQuery): Promise<Cluster[]> => {
  return _.get('/clusters', query);
};

export const fetchCluster = (query: ClusterQuery): Promise<Cluster> => {
  return _.get('/clusters', query);
};

export const createCluster = (data: ClusterCreation) => {
  return _.post('/cluster', data);
};

export const deleteCluster = (query: ClusterQuery) => {
  return _.del('/cluster', query);
};
