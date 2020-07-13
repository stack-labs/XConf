import { Locale as AntLocale } from 'antd/lib/locale-provider';

export interface LocaleValue {
  [key: string]: string | LocaleValue;
}

export interface Locale {
  lng: string;
  langs: string[];
  languageLabel: string;
  antLocale: AntLocale;
  value: LocaleValue;
}
