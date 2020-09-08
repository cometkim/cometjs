import type { $FixMe } from './common';
import type { TupleOf } from './tuple';

// Borrowed from https://twitter.com/danvdk/status/1302978402132074498
export type Add<A extends number, B extends number> = [...TupleOf<unknown, A>, ...TupleOf<unknown, B>]['length'] & number;

export type SubOne<N extends number> = TupleOf<unknown, N> extends [any, ...infer Tail] ? Tail['length'] : never;
export type Sub<A extends number, B extends number> = B extends 0 ? A : Sub<SubOne<A>, SubOne<B>>;

export type Mul<A extends number, B extends number, Result extends number = 0> = B extends 0 ? Result : Mul<A, SubOne<B>, Add<Result, A>>;

export type Mod<A extends number, B extends number> = $FixMe;
