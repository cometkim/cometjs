import type { Callable } from './common';

// Force-infer mapped return type of callable properties
export type MapReturnType<TMap extends object> = (
  keyof TMap extends infer TKey
  ? TKey extends NonNullable<keyof TMap>
  ? TMap[TKey] extends infer TMatch
  ? TMatch extends Callable
  ? ReturnType<TMatch>
  : TMatch // Use as-is if it's not a callable
  : never
  : never
  : never
);

/**
 * Map function to value or just value.
 */
type MapFunction<TValue, TArg> = (
  | TValue
  | ((arg: TArg) => TValue)
);

/**
 * Call map function to value or just value.
 *
 * @param map A map function to value or just value.
 * @param arg A argument to pass to map function.\
 * It will be dropped if map is not a function.
 */
export function mapToValue<TValue, TArg>(map: MapFunction<TValue, TArg>, arg?: TArg): TValue {
  if (typeof map === 'function') {
    return (map as Callable)(arg);
  }
  return map;
}
