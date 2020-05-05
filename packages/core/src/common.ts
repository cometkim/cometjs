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

/**
 * Safely intersect prop types
 */
export type OverrideProps<TBaseProps, TNewProps> = Omit<TBaseProps, keyof TNewProps> & TNewProps;

/**
 * Well-known `U<T>`-like wrapper types
 */
export type BoxType<T = any> = (
  | Promise<T>
  // eslint-disable-next-line @typescript-eslint/array-type
  | Array<T>
  | Set<T>
  | Option<T>
);

/**
 * Unwrap T from well-known `U<T>`-like wrapper type
 */
export type Unwrap<T> = (
  T extends Promise<infer U> ? U :
  T extends Array<infer U> ? U :
  T extends Set<infer U> ? U :
  T extends Option<infer U> ? U :
  T
);

/**
 * Wrap T using well-known `U<T>`-like wrapper type.
 */
export type Wrap<T, Box extends BoxType<T>> = (
  Box extends Promise<any> ? Promise<T> :
  // eslint-disable-next-line @typescript-eslint/array-type
  Box extends Array<any> ? Array<T> :
  Box extends Set<any> ? Set<T> :
  Box extends Option<any> ? Option<T> :
  never
);
