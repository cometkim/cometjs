import type {
  TupleMapWrap,
  TupleMapUnwrap,
  TupleReplace,
  MakeTuple,
} from './tuple';

// $ExpectType [Promise<string>, Promise<number>, Promise<1>, Promise<2>, Promise<null>]
type A = TupleMapWrap<[string, number, 1, 2, null], Promise<any>>;

// $ExpectType [string, number, 1, 2, null]
type B = TupleMapUnwrap<A>;

// $ExpectType [string, string, string, string, string]
type T1 = MakeTuple<string, 5>;

// $ExpectType [number, number, number, number, number]
type T2 = TupleReplace<T1, number>;
