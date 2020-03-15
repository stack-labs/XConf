import { BaseModel, NamespaceExtension } from '@src/typings';

export interface Config extends BaseModel {
  appName: string;
  clusterName: string;
  namespaceName: string;
  format: NamespaceExtension;
  Value: string;
  description?: string;
}
