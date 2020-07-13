import { languages } from '@src/i18n';

const _localStorageKey = '_lng';

export const setComputerLanguage = (lng: string = '') => {
  if (lng) localStorage.setItem(_localStorageKey, lng);
};

export const getComputerLanguage = () => {
  const _localStorageLng = localStorage.getItem(_localStorageKey);
  if (_localStorageLng) return _localStorageLng;

  const language = window.navigator.language;
  const obj = languages.find((l) => l.langs.includes(language));
  if (obj) return obj.lng;
  return null;
};

export const getLanguage = (lng: string) => {
  const obj = languages.find((l) => l.langs.includes(lng));
  if (obj) return obj.lng;
  else return getComputerLanguage() || languages[0].lng;
};
