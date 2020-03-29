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
