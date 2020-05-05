import type {
  Wrap,
  Unwrap,
  BoxType,
} from './common';

// Borrowed core utilities from $mol_type
// See https://github.com/eigenmethod/mol/tree/master/type
export type TupleHead<TTuple extends readonly any[]> = (
  TTuple['length'] extends 0
    ? never
    : TTuple[0]
);
export type TupleTail<TTuple extends readonly any[]> = (
  (
    (...tail: TTuple) => any
  ) extends (
    (head: any, ...tail: infer TTail) => any
  )
    ? TTail
    : never
);
export type TupleAppend<
  TTuple extends readonly any[],
  TItem extends any
> = (
  (
    (head: any, ...tail: TTuple) => void
  ) extends (
    (...extended: infer Extended) => void
  )
  ? {
    [TIndex in keyof Extended]: TIndex extends keyof TTuple
      ? TTuple[TIndex]
      : TItem
    }
  : never
);
export type TuplePrepend<
  TTuple extends readonly any[],
  TItem extends any
> = (
  (
    (head: TItem, ...args: TTuple) => any
  ) extends (
    (...args: infer Result) => any
  )
    ? Result
    : never
);

// Simulate Flow's `$TupleMap<T, F>` utility.
// Copy-pasted bunch of utils using the same pattern because the TypeScript doesn't have `$Call` type.

export type TupleMapPromise<
  Tuple extends readonly any[],
  Result extends readonly any[] = []
> = {
  0: Result,
  1: TupleMapPromise<
    TupleTail<Tuple>,
    TupleAppend<Result, Promise<TupleHead<Tuple>>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type TupleMapReturnType<
  Tuple extends readonly any[],
  Result extends readonly any[] = []
> = {
  0: Result,
  1: TupleMapReturnType<
    TupleTail<Tuple>,
    TupleAppend<Result, ReturnType<TupleHead<Tuple>>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type TupleMapPick<
  Tuple extends readonly any[],
  Key extends string,
  Result extends readonly any[] = []
> = {
  0: Result,
  1: TupleMapPick<
    TupleTail<Tuple>,
    Key,
    TupleAppend<Result, Pick<TupleHead<Tuple>, Key>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type TupleMapUnwrap<
  Tuple extends readonly any[],
  Result extends readonly any[] = []
> = {
  0: Result,
  1: TupleMapUnwrap<
    TupleTail<Tuple>,
    TupleAppend<Result, Unwrap<TupleHead<Tuple>>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type TupleMapWrap<
  Tuple extends readonly any[],
  Box extends BoxType<any>,
  Result extends readonly any[] = []
> = {
  0: Result,
  1: TupleMapWrap<
    TupleTail<Tuple>,
    Box,
    TupleAppend<Result, Wrap<TupleHead<Tuple>, Box>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];
