import type { Callable } from './common';

export type Function<R, X = any> = (
  | R
  | ((domain: X) => R)
);

export type T<R, X = any> = Function<R, X>;

export type Range<TFunction> = TFunction extends T<infer R> ? R : never;

export type MergeMap<
  TFunctionMap extends Record<string, T<any>>
> = Range<TFunctionMap[keyof TFunctionMap]>;

/**
 * Returns result of function, or value as-is.
 *
 * @param range A function of range or a value.
 * @param arg A argument to pass to function.
 *            It will be dropped if range is not a callable.
 */
export function range<R, X = any>(fn: T<R, X>, ...arg: [X?] | []): R {
  if (typeof fn === 'function') {
    return (fn as Callable)(...arg);
  }
  return fn;
}
