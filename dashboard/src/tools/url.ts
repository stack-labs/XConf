import qs from 'querystring';
import { History } from 'history';
import { AnyObject } from '@src/typings';

export const parseSearch = (search: string = ''): AnyObject => {
  return qs.parse(search[0] === '?' ? search.slice(1) : search);
};

export const getNewSearch = (search: string, query: AnyObject): string => {
  const newQuery: AnyObject = { ...parseSearch(search), ...query };
  Object.keys(newQuery).forEach((k) => newQuery[k] ?? delete newQuery[k]);
  return qs.stringify(newQuery);
};

export const replaceSearch = (history: History, query: AnyObject, replacement: boolean = true): string => {
  const location = history.location;
  const hash = location.hash;
  const search = getNewSearch(location.search, query);
  const url = location.pathname + (search ? `?${search}` : '') + hash;
  replacement && history.replace(url);
  return url;
};
