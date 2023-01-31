import { noop } from './common';

export function timeout(ms: number) {
  return new Promise<void>(resolve => void setTimeout(resolve, ms));
}

export interface Deferred<T> extends Promise<T> {
  resolve(value: T): void;
  reject(reason?: unknown): void;
}

export function defer<T>(): Deferred<T> {
  let resolve: (value: T) => void = noop;
  let reject: (reason?: unknown) => void = noop;
  const deferred = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return Object.assign(deferred, { resolve, reject });
}
