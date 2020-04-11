import { BaseModel } from '@src/typings';

export interface AppQuery {
  appName: string;
  version?: number;
}

export interface AppCreation extends AppQuery {
  description?: string;
}

export interface App extends AppQuery, BaseModel {
  description?: string;
}
