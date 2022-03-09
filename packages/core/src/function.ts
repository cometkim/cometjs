import type { Callable } from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type T<R, X = any> = (
  | R
  | ((domain: X) => R)
);

export type Range<TFunction> = TFunction extends T<infer R> ? R : never;

/**
 * Returns result of function, or value as-is.
 *
 * @param fn A function value
 * @param arg A argument to pass to function.
 *            It will be dropped if the given `fn` is not a callable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function range<R, X = any>(fn: T<R, X>, ...arg: [X?] | []): R {
  if (typeof fn === 'function') {
    return (fn as Callable)(...arg) as R;
  }
  return fn;
}

export type MergeMap<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFunctionMap extends Record<string, T<any>>
> = Range<TFunctionMap[keyof TFunctionMap]>;
