import type { InferrableAny } from './common';
import * as Fn from './function';

export type Falsy = (
  | false
  | null
  | undefined
  | 0
  | -0
  | 0n
  | ''
);

export type Truthy<X = InferrableAny> = Exclude<X, Falsy>;

export type T<X> = (
  | Truthy<X>
  | Falsy
);

export function isTruthy<X>(condition: T<X>): condition is Truthy<X> {
  return !!condition;
}

export function isFalsy<X>(condition: T<X>): condition is Falsy {
  return !condition;
}

export function map<X, R>(condition: T<X>, fn: Fn.T<Truthy<R>, X>): T<R> {
  if (isTruthy(condition)) {
    return Fn.range(fn, condition);
  }
  return condition;
}
