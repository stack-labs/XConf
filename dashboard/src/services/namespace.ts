import IFetch from '@src/utils/request';
import { Namespace, NamespaceHistoryItem, NamespaceHistoryQuery, NamespacesQuery } from '@src/typings';

const _ = new IFetch('/admin/api/v1');

export const fetchNamespaces = (query: NamespacesQuery): Promise<Namespace[]> => {
  return _.get('/namespaces', query);
};

export const fetchNamespaceHistories = (query: NamespaceHistoryQuery): Promise<NamespaceHistoryItem[]> => {
  return _.get('/release/history', query);
};
