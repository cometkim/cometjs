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

// Borrowed core utilities from $mol_type
// See https://github.com/eigenmethod/mol/tree/master/type
export type TupleTail<TTuple extends readonly any[]> = (
  (
    (...tail: TTuple) => any
  ) extends (
    (head: any, ...tail: infer TTail) => any
  )
    ? TTail
    : never
);
declare namespace $Experimental {
  // TupleHead<T> and TupleTail<T> implementation using variadic tuple.
  // It's much simpler but type inference is uncertain compared to the previous version.
  export type TupleHead<Tuple extends readonly unknown[]> = Tuple extends [infer Head, ...infer _] ? Head : never;
  export type TupleTail<Tuple extends readonly unknown[]> = Tuple extends [any?, ...infer Tail] ? Tail : never;
}

export type TupleAppend<
  TTuple extends readonly any[],
  TItem
> = [TItem, ...TTuple];

export type TuplePrepend<
  TTuple extends readonly any[],
  TItem
> = [...TTuple, TItem];

// Simulate Flow's `$TupleMap<T, F>` utility.
// Copy-pasted bunch of utils using the same pattern because the TypeScript doesn't have `$Call` type.

export type TupleMapPromise<
  Tuple extends readonly any[],
  Result extends readonly any[] = []
> = {
  0: Result,
  1: TupleMapPromise<
    TupleTail<Tuple>,
    TupleAppend<Result, Promise<$Experimental.TupleHead<Tuple>>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type TupleMapReturnType<
  Tuple extends readonly any[],
  Result extends readonly any[] = []
> = {
  0: Result,
  1: TupleMapReturnType<
    $Experimental.TupleTail<Tuple>,
    TupleAppend<Result, ReturnType<TupleHead<Tuple>>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type TupleMapPick<
  Tuple extends readonly any[],
  Key extends string,
  Result extends readonly any[] = []
> = {
  0: Result, 1: TupleMapPick<
    $Experimental.TupleTail<Tuple>,
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
  $Experimental.TupleTail<Tuple>,
  TupleAppend<Result, Unwrap<$Experimental.TupleHead<Tuple>>>
>,
}[Tuple['length'] extends 0 ? 0 : 1];

export type TupleMapWrap<
  Tuple extends readonly any[],
  Box extends BoxType<any>,
  Result extends readonly any[] = []
> = {
  0: Result,
  1: TupleMapWrap<
    $Experimental.TupleTail<Tuple>,
    Box,
    TupleAppend<Result, Wrap<$Experimental.TupleHead<Tuple>, Box>>
>,
}[Tuple['length'] extends 0 ? 0 : 1];

// Borrowed from https://github.com/microsoft/TypeScript/pull/40002#issue-466243948
export type TupleOf<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N> : never;
export type _TupleOf<T, N extends number> = MakeTuple<T, N>;

// Credits to [Gal Schlezinger](https://github.com/schniz)
// See https://twitter.com/galstar/status/1299265344226439169
//
// @deprecated favor of TupleOf<T, N>
export type MakeTuple<T, N extends number, Result extends readonly T[] = []> = {
  0: Result,
  1: MakeTuple<T, N, [T, ...Result]>,
}[Result['length'] extends N ? 0 : 1];

export type TupleReplace<Tuple extends readonly any[], T, Result extends readonly T[] = []> = {
  0: Result,
  1: TupleReplace<$Experimental.TupleTail<Tuple>, T, [T, ...Result]>,
}[Tuple['length'] extends 0 ? 0 : 1];
