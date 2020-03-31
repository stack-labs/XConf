import IFetch from '@src/utils/request';
import { Namespace, NamespacesQuery } from '@src/typings';

const _ = new IFetch('/admin/api/v1');

export const fetchNamespaces = (query: NamespacesQuery): Promise<Namespace[]> => {
  return _.get('/namespaces', query);
};
