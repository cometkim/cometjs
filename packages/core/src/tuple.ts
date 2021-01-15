import type {
  Wrap,
  Unwrap,
  BoxType,
} from './common';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

// Borrowed core utilities from $mol_type
// See https://github.com/eigenmethod/mol/tree/master/type
export type Head<Tuple extends readonly any[]> = (
  Tuple['length'] extends 0
    ? never
    : Tuple[0]
);

// Borrowed core utilities from $mol_type
// See https://github.com/eigenmethod/mol/tree/master/type
export type Tail<Tuple extends readonly any[]> = (
  (
    (...tail: Tuple) => any
  ) extends (
    (head: any, ...tail: infer Tail) => any
  )
    ? Tail
    : never
);

declare namespace $Experimental {
  // `Head<T>` and `Tail<T>` implementation using variadic tuple.
  // It's much simpler but type inference is uncertain compared to the previous version.

  export type Head<Tuple extends readonly unknown[]> = (
    Tuple extends [infer Head, ...infer _]
      ? Head
      : never
  );
  export type Tail<Tuple extends readonly unknown[]> = (
    Tuple extends [any?, ...infer Tail]
      ? Tail
      : never
  );
}

export type Append<
  Tuple extends readonly any[],
  Item
> = [...Tuple, Item];

export type Prepend<
  Tuple extends readonly any[],
  Item
> = [Item, ...Tuple];

// Simulate Flow's `$TupleMap<T, F>` utility.
// Copy-pasted bunch of utils using the same pattern because the TypeScript doesn't have `$Call` type.

export type MapPromise<
  Tuple extends readonly any[],
  Result extends readonly any[] = []
> = {
  0: Result,
  1: MapPromise<
    Tail<Tuple>,
    Append<Result, Promise<$Experimental.Head<Tuple>>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type MapReturnType<
  Tuple extends readonly any[],
  Result extends readonly any[] = []
> = {
  0: Result,
  1: MapReturnType<
    $Experimental.Tail<Tuple>,
    Append<Result, ReturnType<Head<Tuple>>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type MapPick<
  Tuple extends readonly any[],
  Key extends string,
  Result extends readonly any[] = []
> = {
  0: Result, 1: MapPick<
    $Experimental.Tail<Tuple>,
    Key,
    Append<Result, Pick<Head<Tuple>, Key>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type MapUnwrap<
  Tuple extends readonly any[],
  Result extends readonly any[] = []
> = {
  0: Result,
  1: MapUnwrap<
    $Experimental.Tail<Tuple>,
    Append<Result, Unwrap<$Experimental.Head<Tuple>>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

export type MapWrap<
  Tuple extends readonly any[],
  Box extends BoxType<any>,
  Result extends readonly any[] = []
> = {
  0: Result,
  1: MapWrap<
    $Experimental.Tail<Tuple>,
    Box,
    Append<Result, Wrap<$Experimental.Head<Tuple>, Box>>
  >,
}[Tuple['length'] extends 0 ? 0 : 1];

/**
 * Make tuple of T and given length
 *
 * Borrowed from https://github.com/microsoft/TypeScript/pull/40002#issue-466243948
 */
export type T<X, N extends number> = N extends N ? number extends N ? X[] : _T<X, N> : never;
type _T<X, N extends number> = MakeTuple<X, N>;

/**
 * Credits to [Gal Schlezinger](https://github.com/schniz)
 * @see https://twitter.com/galstar/status/1299265344226439169
 */
type MakeTuple<X, N extends number, Result extends readonly X[] = []> = {
  0: Result,
  1: MakeTuple<X, N, [X, ...Result]>,
}[Result['length'] extends N ? 0 : 1];

export type Replace<Tuple extends readonly any[], X, Result extends readonly X[] = []> = {
  0: Result,
  1: Replace<$Experimental.Tail<Tuple>, X, [X, ...Result]>,
}[Tuple['length'] extends 0 ? 0 : 1];
