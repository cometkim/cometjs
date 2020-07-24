import type { InferrableAny } from './common';

export type Falsy = (
  | false
  | null
  | undefined
  | 0
);

export type Trusthy<T = InferrableAny> = Exclude<T, Falsy>;

export type Conditional<T> = Trusthy<T> | Falsy;

export function isTrusthy<T>(condition: Conditional<T>): condition is Trusthy<T> {
  return Boolean(condition);
}

export function isFalsy<T>(condition: Conditional<T>): condition is Falsy {
  return !Boolean(condition);
}
