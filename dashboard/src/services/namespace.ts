import IFetch from '@src/utils/request';
import {
  Namespace,
  NamespaceCreation,
  NamespaceHistoryItem,
  NamespaceHistoryQuery,
  NamespaceQuery,
  NamespacesQuery,
} from '@src/typings';

const _ = new IFetch('/admin/api/v1');

export const fetchNamespaces = (query: NamespacesQuery): Promise<Namespace[]> => {
  return _.get('/namespaces', query);
};

export const fetchNamespaceHistories = (query: NamespaceHistoryQuery): Promise<NamespaceHistoryItem[]> => {
  return _.get('/release/history', query);
};

export const createNamespace = (data: NamespaceCreation) => {
  return _.post('/namespace', data);
};

export const deleteNamespace = (query: NamespaceQuery) => {
  return _.del('/namespace', query);
};
