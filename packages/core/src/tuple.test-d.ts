import { expectType } from 'tsd';

import { IfEquals } from './common';
import * as Tuple from './tuple';

type T1 = Tuple.MapWrap<[string, number, 1, 2, null], Promise<any>>;
expectType<IfEquals<
  T1,
  [Promise<string>, Promise<number>, Promise<1>, Promise<2>, Promise<null>],
  true
>>(true);

type T2 = Tuple.MapUnwrap<T1>;
expectType<IfEquals<
  T2,
  [string, number, 1, 2, null],
  true
>>(true);

type T3 = Tuple.T<string, 5>;
expectType<IfEquals<
  T3,
  [string, string, string, string, string],
  true
>>(true);

type T4 = Tuple.Replace<T3, number>;
expectType<IfEquals<
  T4,
  [number, number, number, number, number],
  true
>>(true);
