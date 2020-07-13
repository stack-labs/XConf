import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Locale } from 'antd/lib/locale-provider';

import { AnyObject, Language } from '@src/typings';
import { LocaleValue } from '@src/locales/interface';

import enUS from './locales/en_us';
import zhCN from './locales/zh_cn';

const resources: AnyObject<LocaleValue> = {};
const locales = [enUS, zhCN];
export const languages: Language[] = [];
export const antLocales: AnyObject<Locale> = {};
locales.forEach((locale) => {
  resources[locale.lng] = { translation: locale.value };
  antLocales[locale.lng] = locale.antLocale;
  languages.push({ lng: locale.lng, label: locale.languageLabel, langs: locale.langs });
});

i18n
  .use(initReactI18next) // * passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    keySeparator: false, // * we do not use keys in form messages.welcome
    interpolation: { escapeValue: false }, // * react already safes from xss
  });

export default i18n;
