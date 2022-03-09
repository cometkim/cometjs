import type { Callable } from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type T<Y, X = any> = (
  | Y
  | ((domain: X) => Y)
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Domain<TFn> = TFn extends ((x: infer X) => any) ? X : void;

export type Range<TFn> = TFn extends T<infer R> ? R : never;

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
