import { BaseModel } from '@src/typings';

export interface ClusterQuery {
  appName: string;
  clusterName: string;
}

export interface ClusterCreation extends ClusterQuery {
  description?: string;
}

export interface Cluster extends ClusterQuery, BaseModel {
  description?: string;
}
