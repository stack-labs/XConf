import { BaseModel } from '@src/typings';

export interface Cluster extends BaseModel {
  appName: string;
  clusterName: string;
  description?: string;
}
