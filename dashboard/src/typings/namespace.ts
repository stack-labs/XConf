import { BaseModel } from '@src/typings';

export enum NamespaceFormat {
  JSON = 'json',
  YAML = 'yaml',
  TOML = 'toml',
  CUSTOM = 'custom',
}

export interface NamespacesQuery {
  appName: string;
  clusterName: string;
  version?: number;
}

export interface NamespaceHistoryQuery extends NamespacesQuery {
  namespaceName: string;
}

export interface Namespace extends BaseModel, NamespaceHistoryQuery {
  format: NamespaceFormat;
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

export interface NamespaceCreation extends NamespacesQuery {
  format: NamespaceFormat;
  namespaceName: string;
  description?: string;
}
