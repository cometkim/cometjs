/**
 * Any object that can be called
 */
export interface Callable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): any;
}

export function callable(v: unknown): Callable {
  if (typeof v !== 'function') {
    throw new Error(`Expected a callable value, but got ${typeof v}`);
  }
  return v as Callable;
}

/**
 * Assert given value is non-nullable, and tell it to TypeScript
 */
export function required<T>(v: T): asserts v {
  if (v == null) {
    throw new Error(`Expected non nullable, but got ${typeof v}`);
  }
}

/**
 * JavaScript's primitive types
 */
export type Primitive = (
  | null
  | undefined
  | boolean
  | string
  | number
  | bigint
  | symbol
);

/**
 * Alternative to `any`
 *
 * Helpful when need `any` as value type but should be inferred more precisely
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type InferrableAny = Primitive | object;

/**
 * Simulate Flow's `$NonMaybeType<mixed>`.
 * Theoretically same as `Exclude<unknown, null | undefined>` that doesn't work on current version of TypeScript.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type NonMaybeType = {};

/**
 * Strict presentation of empty object
 */
export type EmptyObject = Record<string, never>;

/**
 * Strict presentation of any object
 */
export type AnyObject = Record<string, unknown>;

/**
 * Safely intersect prop types
 */
export type OverrideProps<TBaseProps, TNewProps> = Omit<TBaseProps, keyof TNewProps> & TNewProps;

/**
 * Well-known `U<T>`-like nominal types
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BoxType<T = any> = (
  | Promise<T>
  // eslint-disable-next-line @typescript-eslint/array-type
  | Array<T>
  | Set<T>
);

/**
 * Unwrap BoxType<T>.
 */
export type Unwrap<T> = (
  T extends Promise<infer U> ? U :
  T extends Array<infer U> ? U :
  T extends Set<infer U> ? U :
  never
);

/**
 * Wrap T by BoxType.
 */
export type Wrap<T, Box extends BoxType> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Box extends Promise<any> ? Promise<T> :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/array-type
  Box extends Array<any> ? Array<T> :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Box extends Set<any> ? Set<T> :
  never
);

export type OneOrMany<T> = T | T[];

/**
 * Check type-level equally of given two types.
 *
 * the first one (or `A` if specified) is going to return type if true,
 * or returns `never` (of `B` if specified)
 */
export type IfEquals<X, Y, A = X, B = never> = (
  (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? A
  : B
);

/**
 * @see https://stackoverflow.com/a/49725198/5734400
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = (
  & Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
);

/**
 * @see https://stackoverflow.com/a/49725198/5734400
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = (
  & Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: (
      & Required<Pick<T, K>>
      & Partial<Record<Exclude<Keys, K>, undefined>>
    )
  }[Keys]
);

/**
 * A callable object do nothing
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop: Callable = () => {};

/**
 * identity
 */
export const ident = <X>(x: X): X => x;

/**
 * for type-level assertion
 */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function expectType<T>(_: T): void {}

/**
 * for type-level assertion (loose)
 */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function expectAssignable<A, B extends A = A>(_: B): void {}

/**
 * Check if given two type params are equal.
 */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function expectEquals<A, B>(..._: IfEquals<A, B, [true?], [false]>): void {}
