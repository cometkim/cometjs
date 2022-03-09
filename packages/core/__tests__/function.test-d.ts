import { expectEquals } from '../src/common';
import * as Fn from '../src/function';

type fn1 = (x: string) => number;
type fn2 = (x: string) => string;
type fn3 = bigint;

expectEquals<
  Fn.Domain<fn1>,
  string
>();

expectEquals<
  Fn.Range<fn1>,
  number
>();

expectEquals<
  Fn.MergeRange<[fn1, fn2, fn3]>,
  number | string | bigint
>();

expectEquals<
  Fn.MergeRange<{
    fn1: fn1,
    fn2: fn2,
    fn3: fn3,
  }>,
  number | string | bigint
>();
