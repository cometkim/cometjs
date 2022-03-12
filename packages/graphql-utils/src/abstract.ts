import type { InferrableAny } from '@cometjs/core';
import { Fn, Option } from '@cometjs/core';

/**
 * An abstract type has serval subtypes based on `__typename` field.
 * Such as the GraphQL's interface/union response.
 */
export type GraphQLAbstractType<TSubtype extends string> = {
  __typename?: TSubtype,
};
export type GraphQLUnion<TSubtype extends string> = GraphQLAbstractType<TSubtype>;
export type GraphQLInterface<TSubtype extends string> = GraphQLAbstractType<TSubtype>;

// Force-infer `__typename` property as literal than string
export type SubtypeName<T> = T extends GraphQLAbstractType<infer TType> ? TType : never;

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param abstract
 * @param rangeMap ranges of subtypes
 *
 * @return value of the matched subtype range
 */
export function mapAbstractType<
  TAbstract extends GraphQLAbstractType<string>,
  TSubtype extends SubtypeName<TAbstract>,
  TRangeMap extends {
    [TKey in TSubtype]: Fn.T<InferrableAny, Extract<TAbstract, GraphQLAbstractType<TKey>>>;
  },
  >(
    abstract: TAbstract,
    rangeMap: TRangeMap,
): Fn.MergeRange<TRangeMap> {
  if (!abstract.__typename) {
    throw new Error('The given object doesn\'t have __typename');
  }
  const range = rangeMap[abstract.__typename as TSubtype];
  // eslint-disable-next-line
  // @ts-ignore
  return Fn.range(range, abstract);
}
export const mapUnion = mapAbstractType;
export const mapInterface = mapAbstractType;

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param abstract
 * @param rangeMap range of subtypes.
 *                 This should have additional map in `_` so use it as fallback for unmatched/none value.
 *
 * @return Return value of the mapper for matched subtype or the default range
 */
export function mapAbstractTypeWithDefault<
  TAbstract extends GraphQLAbstractType<string>,
  TSubtype extends SubtypeName<TAbstract>,
  TRangeMap extends {
    [TKey in TSubtype]?: Fn.T<InferrableAny, Extract<TAbstract, GraphQLAbstractType<TKey>>>;
  },
  RDefault,
  >(
    abstract: TAbstract,
    rangeMap: (
      & TRangeMap
      & { _: Fn.T<RDefault, TAbstract> }
    ),
): (
    | Fn.MergeRange<TRangeMap>
    | RDefault
  ) {
  if (!abstract.__typename) {
    throw new Error('The given object doesn\'t have __typename');
  }
  const range = rangeMap[abstract.__typename as TSubtype];
  const defaultRange = rangeMap['_'];

  // eslint-disable-next-line
  // @ts-ignore
  return range
    ? Fn.range(range, abstract as any) // eslint-disable-line
    : Fn.range(defaultRange, abstract);
}
export const mapUnionWithDefault = mapAbstractTypeWithDefault;
export const mapInterfaceWithDefault = mapAbstractTypeWithDefault;

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param abstract
 * @param rangeMap range of subtypes.
 *
 * @return Return value of the mapper for matched subtype or the default range
 */
export function mapOptionalAbstractType<
  TAbstract extends GraphQLAbstractType<string>,
  TSubtype extends SubtypeName<TAbstract>,
  TRangeMap extends {
    [TKey in TSubtype]: Fn.T<InferrableAny, Extract<TAbstract, GraphQLAbstractType<TKey>>>;
  },
  >(
    abstract: Option.T<TAbstract>,
    rangeMap: TRangeMap,
): Option.T<Fn.MergeRange<TRangeMap>> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return Option.map(abstract, abstract => mapAbstractType(abstract, rangeMap as any));
}
export const mapOptionalUnion = mapOptionalAbstractType;
export const mapOptionalInterface = mapOptionalAbstractType;

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param abstract
 * @param rangeMap range of subtypes.
 *                 This should have additional map in `_` so use it as fallback for unmatched/none value.
 *
 * @return Return value of the mapper for matched subtype or the default range
 */
export function mapOptionalAbstractTypeWithDefault<
  TAbstract extends GraphQLAbstractType<string>,
  TSubtype extends SubtypeName<TAbstract>,
  TRangeMap extends {
    [TKey in TSubtype]?: Fn.T<InferrableAny, Extract<TAbstract, GraphQLAbstractType<TKey>>>;
  },
  RDefault,
  >(
    abstract: Option.T<TAbstract>,
    rangeMap: (
      & TRangeMap
      & { _: Fn.T<RDefault, TAbstract> }
    ),
): Option.T<(
  | Fn.MergeRange<TRangeMap>
  | RDefault
)> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return Option.map(abstract, abstract => mapAbstractTypeWithDefault(abstract, rangeMap as any));
}
export const mapOptionalUnionWithDefault = mapOptionalAbstractTypeWithDefault;
export const mapOptionalInterfaceWithDefault = mapOptionalAbstractTypeWithDefault;
