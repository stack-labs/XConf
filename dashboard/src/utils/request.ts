import qs from 'querystring';
import { AnyObject } from '@src/typings';

interface CustomRequestOption {
  isCors?: boolean;
  timeout?: number;
}

export interface RequestType extends RequestInit, CustomRequestOption {}

const CorsMode: RequestType = { mode: 'cors', credentials: 'include' };

export class TimeoutError extends Error {
  constructor(msg?: string) {
    super(`Timeout Error: ${msg || 'Request timeout'}`);
  }
}

export class AbortedError extends Error {
  constructor(msg?: string) {
    super(`Aborted Error: ${msg || 'Request aborted'}`);
  }
}

enum ContentType {
  JSON = 'application/json',
  FORM = 'application/x-www-form-urlencoded',
}

const splitArgs = (args: any[]) => {
  let url, query, data, option;
  if (args.length === 1) [url] = args;
  else if (args.length === 2) [url, data] = args;
  else if (args.length === 3) [url, query, data] = args;
  else [url, query, data, option] = args;

  return { url, query: query || {}, data: data || {}, option: option || {} };
};

export const getErrorMessage = (data: any): string => {
  if (typeof data === 'string') return data;
  return data.msg || data.message || data.errMsg || data.errMessage;
};

export const joinQuery = (params?: AnyObject) => {
  if (!params) return '';
  return '?' + qs.stringify(params);
};

export const isStatusSuccess = (status: number) => status >= 200 && status < 300;

export const handleResult = (data: any) => {
  if (!data) return data;
  if (typeof data === 'string' || typeof data === 'number' || Array.isArray(data)) return data;

  if ('code' in data) {
    if (data.code !== 0 && data.code !== '0') throw new Error(getErrorMessage(data) || '未知错误');
    return data.data;
  }
  return data;
};

export const handleJson = (status: number, response: Response) => {
  return response.json().then((data) => {
    if (isStatusSuccess(status)) return Promise.resolve(data);
    throw new Error(getErrorMessage(data) || response.statusText || '未知错误');
  });
};

export const handleText = (status: number, response: Response) => {
  return response.text().then((text) => {
    if (isStatusSuccess(status)) return Promise.resolve(text);
    throw new Error(text || response.statusText || '未知错误');
  });
};

export const handleResponse = (response: Response) => {
  const status = response.status;
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes(ContentType.JSON);
  return isJson ? handleJson(status, response) : handleText(status, response);
};

class IFetch {
  baseUrl: string;
  isCors: boolean;
  timeout: number;

  constructor(baseUrl: string = '', opt?: CustomRequestOption) {
    this.baseUrl = baseUrl;
    this.isCors = opt?.isCors ?? true;
    this.timeout = opt?.timeout ?? 120000;
  }

  request(url: string, option: RequestType) {
    let timer: NodeJS.Timeout;
    const controller = new AbortController();
    const signal = controller.signal;
    const isCors = option.isCors ?? this.isCors;
    const timeout = option.timeout ?? this.timeout;
    const opt: RequestType = isCors ? { ...CorsMode, ...option, signal } : { ...option, signal };

    const queue = [];
    if (timeout) {
      queue.push(
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new AbortedError());
          }, timeout);
        }),
      );
    }
    queue.push(
      fetch(this.baseUrl + url, opt)
        .catch((err) => {
          if (err.name === 'TypeError') throw new Error(`当前网络异常, 请稍后重试: ${err.message}`);
          throw new Error(`请求发送失败: ${err.message}`);
        })
        .finally(() => timer && clearTimeout(timer)),
    );

    const promise = Promise.race(queue);
    const abort = () => controller.abort();
    return new Proxy(
      { promise },
      {
        get: function (obj: AnyObject, key: string) {
          if (key === 'abort') return abort;
          if (key === 'then') return obj.promise.then.bind(obj.promise);
          if (key === 'catch') return obj.promise.catch.bind(obj.promise);
          if (key === 'finally') return obj.promise.finally.bind(obj.promise);
          return obj[key];
        },
      },
    );
  }

  _request<R = unknown>(url: string, option: RequestType): Promise<R> {
    const result = this.request(url, option);
    result.promise = result.then(handleResponse).then(handleResult);
    return result as Promise<R>;
  }

  get<R = unknown>(url: string, query?: AnyObject, option?: RequestType): Promise<R> {
    return this._request(url + joinQuery(query), { ...option, method: 'get' });
  }

  del<R = unknown>(url: string, query?: AnyObject, option?: RequestType): Promise<R> {
    return this._request(url + joinQuery(query), { ...option, method: 'delete' });
  }

  post<R = any>(url: string): Promise<R>;
  post<R = any>(url: string, data: AnyObject): Promise<R>;
  post<R = any>(url: string, query: AnyObject, data: AnyObject): Promise<R>;
  post<R = any>(url: string, query: AnyObject, data: AnyObject, option: RequestType): Promise<R>;
  post(...args: any[]) {
    const { url, query, data, option } = splitArgs(args);
    return this.postJson(url, query, data, option);
  }

  postJson<R = any>(url: string): Promise<R>;
  postJson<R = any>(url: string, data: AnyObject): Promise<R>;
  postJson<R = any>(url: string, query: AnyObject, data: AnyObject): Promise<R>;
  postJson<R = any>(url: string, query: AnyObject, data: AnyObject): Promise<R>;
  postJson<R = any>(url: string, query: AnyObject, data: AnyObject, option: RequestType): Promise<R>;
  postJson(...args: any[]) {
    const { url, query, data, option } = splitArgs(args);
    return this._request(url + joinQuery(query), {
      ...option,
      method: 'post',
      body: data ? JSON.stringify(data) : undefined,
      headers: { ...option.headers, 'Content-Type': ContentType.JSON },
    });
  }
  postForm<R = any>(url: string): Promise<R>;
  postForm<R = any>(url: string, data: AnyObject): Promise<R>;
  postForm<R = any>(url: string, query: AnyObject, data: AnyObject): Promise<R>;
  postForm<R = any>(url: string, query: AnyObject, data: AnyObject, option: RequestType): Promise<R>;
  postForm(...args: any[]) {
    const { url, query, data, option } = splitArgs(args);
    return this._request(url + joinQuery(query), {
      ...option,
      method: 'post',
      body: data ? qs.stringify(data) : undefined,
      headers: { ...option.headers, 'Content-Type': ContentType.FORM },
    });
  }

  postFormData<R = any>(url: string): Promise<R>;
  postFormData<R = any>(url: string, data: FormData): Promise<R>;
  postFormData<R = any>(url: string, query: AnyObject, data: FormData): Promise<R>;
  postFormData<R = any>(url: string, query: AnyObject, data: FormData, option: RequestType): Promise<R>;
  postFormData(...args: any[]) {
    const { url, query, data, option } = splitArgs(args);
    return this._request(url + joinQuery(query), { ...option, method: 'post', body: data });
  }

  put<R = any>(url: string): Promise<R>;
  put<R = any>(url: string, data: AnyObject): Promise<R>;
  put<R = any>(url: string, query: AnyObject, data: AnyObject): Promise<R>;
  put<R = any>(url: string, query: AnyObject, data: AnyObject, option: RequestType): Promise<R>;
  put(...args: any[]) {
    const { url, query, data, option } = splitArgs(args);
    return this.putJson(url, query, data, option);
  }

  putJson<R = any>(url: string): Promise<R>;
  putJson<R = any>(url: string, data: AnyObject): Promise<R>;
  putJson<R = any>(url: string, query: AnyObject, data: AnyObject): Promise<R>;
  putJson<R = any>(url: string, query: AnyObject, data: AnyObject, option: RequestType): Promise<R>;
  putJson(...args: any[]) {
    const { url, query, data, option } = splitArgs(args);
    return this._request(url + joinQuery(query), {
      ...option,
      method: 'put',
      body: data ? JSON.stringify(data) : undefined,
      headers: { ...option.headers, 'Content-Type': ContentType.JSON },
    });
  }

  putForm<R = any>(url: string): Promise<R>;
  putForm<R = any>(url: string, data: AnyObject): Promise<R>;
  putForm<R = any>(url: string, query: AnyObject, data: AnyObject): Promise<R>;
  putForm<R = any>(url: string, query: AnyObject, data: AnyObject, option: RequestType): Promise<R>;
  putForm(...args: any[]) {
    const { url, query, data, option } = splitArgs(args);
    return this._request(url + joinQuery(query), {
      ...option,
      method: 'put',
      body: data ? qs.stringify(data) : undefined,
      headers: { ...option.headers, 'Content-Type': ContentType.FORM },
    });
  }

  putFormData<R = any>(url: string): Promise<R>;
  putFormData<R = any>(url: string, data: FormData): Promise<R>;
  putFormData<R = any>(url: string, query: AnyObject, data: FormData): Promise<R>;
  putFormData<R = any>(url: string, query: AnyObject, data: FormData, option: RequestType): Promise<R>;
  putFormData(...args: any[]) {
    const { url, query, data, option } = splitArgs(args);
    return this._request(url + joinQuery(query), { ...option, method: 'put', body: data });
  }
}

export default IFetch;
