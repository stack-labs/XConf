/// <reference types="react-scripts" />

interface Promise<T> {
  abort?: Function;
}

declare var jsyaml: any;
declare module 'js-yaml';

declare var jsonlint: any;
declare module 'jsonlint-mod';
