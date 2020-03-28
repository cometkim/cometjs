import type { InferrableAny } from '@cometjs/core/common';
import type { Option, Some } from '@cometjs/core/option';
import { mapToValue, MapReturnType } from '@cometjs/core/map';

/**
 * An abstract type has serval subtypes based on `__typename` field.
 * Such as the GraphQL's interface/union response.
 */
export type GraphQLAbstractType<TSubtype extends string> = {
  __typename?: TSubtype,
};
export type Union<TSubtype extends string> = GraphQLAbstractType<TSubtype>;
export type Interface<TSubtype extends string> = GraphQLAbstractType<TSubtype>;

// Force-infer `__typename` property as literal than string
export type SubtypeName<T> = T extends GraphQLAbstractType<infer TType> ? TType : never;


/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param object
 * @param subtypeMatcher Subtype mappers
 *
 * @return Return value of the mapper function for matched subtype
 */
export function mapAbstractType<
  TAbstract extends GraphQLAbstractType<string>,
  TSubtype extends SubtypeName<TAbstract>,
  TSubtypeMatcher extends {
    [TKey in TSubtype]: ((fragment: Extract<TAbstract, GraphQLAbstractType<TKey>>) => any) | InferrableAny;
  },
>(
  object: TAbstract,
  subtypeMatcher: TSubtypeMatcher,
): MapReturnType<TSubtypeMatcher> {
  if (!object.__typename) {
    throw new Error(`The given fragment doesn't have __typename property`);
  }
  const map = subtypeMatcher[object.__typename as TSubtype];
  return mapToValue(map, object as any) as MapReturnType<TSubtypeMatcher>;
};
export const mapUnion = mapAbstractType;
export const mapInterface = mapAbstractType;

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param object
 * @param subtypeMatcher Subtype mappers that can be/returns optional.\
 * This should have additional map in `_` so use it as fallback for unmatched/none value.
 *
 * @return Return value of the mapper for matched subtype or the default mapper
 */
export function mapAbstractTypeWithDefault<
  TAbstract extends GraphQLAbstractType<string>,
  TSubtype extends SubtypeName<TAbstract>,
  TSubtypeMatcher extends {
    [TKey in TSubtype]?: ((union: Extract<TAbstract, GraphQLAbstractType<TKey>>) => any) | InferrableAny;
  },
  RDefault,
>(
  object: TAbstract,
  subtypeMatcher: (
    & TSubtypeMatcher
    & {
      _: ((object: TAbstract) => RDefault) | RDefault,
    }
  )
): (
  | Some<MapReturnType<TSubtypeMatcher>>
  | RDefault
) {
  if (!object.__typename) {
    throw new Error(`The given fragment doesn't have __typename property`);
  }
  const defaultMap = subtypeMatcher['_'];
  const map = subtypeMatcher[object.__typename as TSubtype];
  if (!map) {
    // fallback to default when the object has no matched map
    return mapToValue(defaultMap, object);
  }
  const result = mapToValue(map, object as any) as Option<MapReturnType<TSubtypeMatcher>>;
  // fallback to default when the mapped result is none
  return result ?? mapToValue(defaultMap, object);
};
export const mapUnionWithDefault = mapAbstractTypeWithDefault;
export const mapInterfaceWithDefault = mapAbstractTypeWithDefault;
