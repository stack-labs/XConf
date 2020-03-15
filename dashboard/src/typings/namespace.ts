import { BaseModel } from '@src/typings';

export enum NamespaceExtension {}

export interface Namespace extends BaseModel {
  appName: string;
  clusterName: string;
  namespaceName: string;
  format: NamespaceExtension;
  description?: string;
}
