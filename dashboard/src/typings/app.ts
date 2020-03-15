import { BaseModel } from '@src/typings';

export interface App extends BaseModel {
  appName: string;
  description?: string;
}
