import { BaseModel } from '@src/typings';

export enum NamespaceExtension {}

export interface NamespacesQuery {
  appName: string;
  clusterName: string;
}

export interface Namespace extends BaseModel, NamespacesQuery {
  namespaceName: string;
  format: NamespaceExtension;
  value: string;
  released: boolean;
  editValue: string;
  description?: string;
}
