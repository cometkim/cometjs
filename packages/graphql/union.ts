import type { Callable, InferrableAny } from '@cometjs/core/common';

/**
 * A type has serval subtypes based on `__typename` field.
 * Such as the GraphQL's interface/union response.
 */
export type Union<TPossible extends string> = {
  __typename?: TPossible,
};

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param union
 * @param subtypeMatcher Subtype mappers
 *
 * @return Return value of the mapper function for matched subtype
 */
export function mapUnion<
  TUnion extends Union<string>,
  TPossible extends SubtypeName<TUnion>,
  TSubtypeMatcher extends {
    [TKey in TPossible]: ((fragment: Extract<TUnion, Union<TKey>>) => any) | InferrableAny;
  },
>(
  union: TUnion,
  subtypeMatcher: TSubtypeMatcher,
): MapReturnType<TSubtypeMatcher> {
  if (!union.__typename) {
    throw new Error(`The given fragment doesn't have __typename property`);
  }

  const map = subtypeMatcher[union.__typename as TPossible];

  if (typeof map === 'function') {
    return map(union as any);
  }

  return map as any;
};

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param union
 * @param subtypeMatcher Subtype mappers that can be optional
 *
 * @return Return value of the mapper for matched subtype or the default mapper
 */
export function mapUnionWithDefault<
  TUnion extends Union<string>,
  TPossible extends SubtypeName<TUnion>,
  TSubtypeMatcher extends {
    [TKey in TPossible]?: ((union: Extract<TUnion, Union<TKey>>) => any) | InferrableAny;
  },
  RDefault,
>(
  union: TUnion,
  subtypeMatcher: (
    & TSubtypeMatcher
    & {
      _: (() => RDefault) | RDefault,
    }
  )
): (
  | MapReturnType<TSubtypeMatcher>
  | RDefault
) {
  if (!union.__typename) {
    throw new Error(`The given fragment doesn't have __typename property`);
  }

  const defaultMap = subtypeMatcher['_'];
  const map = subtypeMatcher[union.__typename as TPossible] ?? defaultMap;

  if (typeof map === 'function') {
    return (map as any)(union);
  }
  return map as any;
};

// Force-infer `__typename` property as literal than string
type SubtypeName<T> = T extends Union<infer TType> ? TType : never;

// Force-infer mapped return type of callable properties
type MapReturnType<TMap extends object> = (
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
