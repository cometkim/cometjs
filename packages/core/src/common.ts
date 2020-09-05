import type { Option } from './option';

/**
 * Any object that can be called
 */
export interface Callable {
  (...args: any[]): any;
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
export type InferrableAny = Primitive | object;

// Simulate Flow's `$NonMaybeType<mixed>`.
// Theoretically same as `Exclude<unknown, null | undefined>` that doesn't work on current version of TypeScript.
export type NonMaybeType = {};
// Also same as
// export type NonMaybeType = Exclude<InferrableAny, None>;

/**
 * Safely intersect prop types
 */
export type OverrideProps<TBaseProps, TNewProps> = Omit<TBaseProps, keyof TNewProps> & TNewProps;

/**
 * Well-known `U<T>`-like nominal types
 */
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
  T
);

/**
 * Wrap T by BoxType.
 */
export type Wrap<T, Box extends BoxType> = (
  Box extends Promise<any> ? Promise<T> :
  // eslint-disable-next-line @typescript-eslint/array-type
  Box extends Array<any> ? Array<T> :
  Box extends Set<any> ? Set<T> :
  never
);
