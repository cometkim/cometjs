import { expectEquals } from './common';
import * as Tuple from './tuple';

/* eslint-disable @typescript-eslint/no-explicit-any */

type T1 = Tuple.MapWrap<[string, number, 1, 2, null], Promise<any>>;
expectEquals<
  T1,
  [Promise<string>, Promise<number>, Promise<1>, Promise<2>, Promise<null>]
>();

type T2 = Tuple.MapUnwrap<T1>;
expectEquals<
  T2,
  [string, number, 1, 2, null]
>();

type T3 = Tuple.T<string, 5>;
expectEquals<
  T3,
  [string, string, string, string, string]
>();

type T4 = Tuple.Replace<T3, number>;
expectEquals<
  T4,
  [number, number, number, number, number]
>();
