import { BaseModel } from '@src/typings';

export interface Release extends BaseModel {
  appName: string;
  clusterName: string;
  namespaceName: string;
  tag: string;
  comment?: string;
}
