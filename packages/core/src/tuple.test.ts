import type { TupleMapWrap, TupleMapUnwrap } from './tuple';

// $ExpectType [Promise<string>, Promise<number>, Promise<1>, Promise<2>, Promise<null>]
type A = TupleMapWrap<[string, number, 1, 2, null], Promise<any>>;

// $ExpectType [string, number, 1, 2, null]
type B = TupleMapUnwrap<A>;
