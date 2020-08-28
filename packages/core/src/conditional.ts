import type { InferrableAny } from './common';

export type Falsy = (
  | false
  | null
  | undefined
  | 0
);

export type Truhty<T = InferrableAny> = Exclude<T, Falsy>;

export type Conditional<T> = Truhty<T> | Falsy;

export function isTruhty<T>(condition: Conditional<T>): condition is Truhty<T> {
  return Boolean(condition);
}

export function isFalsy<T>(condition: Conditional<T>): condition is Falsy {
  return !Boolean(condition);
}
