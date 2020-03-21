import type { Callable, InferrableAny } from '@cometjs/core/common';
import type { Some } from '@cometjs/core/option';

/**
 * A type has serval subtypes based on `__typename` field.
 * Such as the GraphQL's interface/union response.
 */
export type Fragment<TPossible extends string> = {
  __typename?: TPossible,
};

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param fragment
 * @param fragmentMatcher Subtype mappers
 *
 * @return Return value of the mapper function for matched subtype
 */
export function mapFragment<
  TFragment extends Fragment<string>,
  TPossible extends PossibleTypeName<TFragment>,
  TFragmentMatcher extends {
    [TKey in TPossible]: ((fragment: Extract<TFragment, Fragment<TKey>>) => any) | InferrableAny;
  },
>(
  fragment: TFragment,
  fragmentMatcher: TFragmentMatcher,
): MapReturnType<TFragmentMatcher> {
  if (!fragment.__typename) {
    throw new Error(`The given fragment doesn't have __typename property`);
  }

  const map = fragmentMatcher[fragment.__typename as TPossible];

  if (typeof map === 'function') {
    return map(fragment as any);
  }

  return map as any;
};

/**
 * Subtype mapper utility for GraphQL interface/union type response.
 *
 * @param fragment
 * @param fragmentMatcher Subtype mappers that can be optional
 *
 * @return Return value of the mapper for matched subtype or the default mapper
 */
export function mapFragmentWithDefault<
  TFragment extends Fragment<string>,
  TPossible extends PossibleTypeName<TFragment>,
  TFragmentMatcher extends {
    [TKey in TPossible]?: ((fragment: Extract<TFragment, Fragment<TKey>>) => any) | Some<InferrableAny>;
  },
  RDefault,
>(
  fragment: TFragment,
  fragmentMatcher: (
    & TFragmentMatcher
    & {
      _: (() => RDefault) | RDefault,
    }
  )
): (
  | MapReturnType<TFragmentMatcher>
  | RDefault
) {
  if (!fragment.__typename) {
    throw new Error(`The given fragment doesn't have __typename property`);
  }

  const defaultMap = fragmentMatcher['_'];
  const map = fragmentMatcher[fragment.__typename as TPossible] ?? defaultMap;

  if (typeof map === 'function') {
    return (map as any)(fragment);
  }
  return map as any;
};

// Force-infer `__typename` property as literal than string
type PossibleTypeName<T> = T extends Fragment<infer TType> ? TType : never;

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
