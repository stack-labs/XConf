import IFetch from '@src/utils/request';
import { Cluster, ClusterQuery } from '@src/typings';

const _ = new IFetch('/admin/api/v1');

export const fetchClusters = (query: ClusterQuery): Promise<Cluster[]> => {
  return _.get('/clusters', query);
};
