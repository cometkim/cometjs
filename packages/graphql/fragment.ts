import type { Callable } from '@cometjs/core/common';

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
    [TKey in TPossible]: (fragment: Extract<TFragment, Fragment<TKey>>) => any;
  },
>(
  fragment: TFragment,
  fragmentMatcher: TFragmentMatcher,
): MapReturnType<TFragmentMatcher> {
  if (!fragment?.__typename) {
    throw new Error(`The object doesn't have __typename property`);
  }

  const mapper = fragmentMatcher[fragment.__typename as TPossible];

  if (!mapper) {
    throw new Error(`Missing the mapping for __typename: ${fragment.__typename}`);
  }

  if (typeof mapper !== 'function') {
    throw new Error(`Mapping to not-callable isn't allowed`);
  }

  return mapper(fragment as any);
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
    [TKey in TPossible]?: (fragment: Extract<TFragment, Fragment<TKey>>) => any;
  },
  RDefault,
>(
  fragment: TFragment,
  fragmentMatcher: (
    & TFragmentMatcher
    & {
      _: () => RDefault,
    }
  )
): (
  | MapReturnType<TFragmentMatcher>
  | RDefault
) {
  if (!fragment?.__typename) {
    throw new Error(`The object doesn't have __typename property`);
  }

  const defaultMapper = fragmentMatcher['_'];
  const mapper = fragmentMatcher[fragment.__typename as TPossible] || defaultMapper;

  if (!mapper) {
    throw new Error(`The object doesn't have any mapping to fragment`);
  }

  if (typeof mapper !== 'function') {
    throw new Error(`Mapping to not-callable isn't allowed`);
  }

  return mapper(fragment as any);
};

// Force-infer `__typename` property as literal than string
type PossibleTypeName<T> = T extends Fragment<infer TType> ? TType : never;

// Force-infer mapped return type of callable properties
type MapReturnType<TMap extends object> = (
  keyof TMap extends infer TKey
  ? TKey extends NonNullable<keyof TMap>
  ? TMap[TKey] extends infer TFn
  ? TFn extends Callable
  ? ReturnType<TFn>
  : never
  : never
  : never
  : never
);
