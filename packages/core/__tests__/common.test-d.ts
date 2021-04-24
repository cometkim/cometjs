import type { Awaited } from '../src';
import { expectEquals } from '../src';

type p1 = number;
expectEquals<
  Awaited<p1>,
  number
>();

type p2 = Promise<number>;
expectEquals<
  Awaited<p2>,
  number
>();

type p3 = Promise<Promise<number>>;
expectEquals<
  Awaited<p3>,
  number
>();

type p4 = Promise<Promise<number> | undefined>;
expectEquals<
  Awaited<p4>,
  number | undefined
>();
