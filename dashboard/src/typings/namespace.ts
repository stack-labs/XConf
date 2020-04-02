import { BaseModel } from '@src/typings';

export enum NamespaceExtension {}

export interface NamespacesQuery {
  appName: string;
  clusterName: string;
}

export interface NamespaceHistoryQuery extends NamespacesQuery {
  namespaceName: string;
}

export interface Namespace extends BaseModel, NamespaceHistoryQuery {
  format: NamespaceExtension;
  value: string;
  released: boolean;
  editValue: string;
  description?: string;
}

export interface NamespaceHistoryItem extends BaseModel, NamespaceHistoryQuery {
  value: string;
  comment: string;
  released: boolean;
  tag: string;
}
