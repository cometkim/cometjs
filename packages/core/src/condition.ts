import type { InferrableAny } from './common';

export type Falsy = (
  | false
  | null
  | undefined
  | 0
);

export type Truthy<T = InferrableAny> = Exclude<T, Falsy>;

export type Condition<T> = Truthy<T> | Falsy;

export function isTruthy<T>(condition: Condition<T>): condition is Truthy<T> {
  return Boolean(condition);
}

export function isFalsy<T>(condition: Condition<T>): condition is Falsy {
  return !Boolean(condition);
}
