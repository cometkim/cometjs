import * as React from 'react';
import type {
  ApolloError,
  DocumentNode,
  TypedDocumentNode,
  QueryHookOptions as ApolloQueryHooksOptions,
} from '@apollo/client';
import { useQuery as useApolloQuery } from '@apollo/client';
import { Function as Fn } from '@cometjs/core';

export const UseApolloQueryContext = React.createContext(useApolloQuery);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  UseApolloQueryContext.displayName = 'UseApolloQueryContext';
}

type LoadingResult = {
  status: 'loading',
};

type ErrorResult = {
  status: 'error',
  error: ApolloError,
  refetch: () => void,
};

type DataResult<T> = {
  status: 'data',
  data: T,
  refetch: () => void,
};

type Result<TData> = (
  | LoadingResult
  | ErrorResult
  | DataResult<TData>
);

export function mapResult<
  TData,
  RLoading,
  RError,
  RData
>(result: Result<TData>, fn: {
  loading: Fn.T<RLoading, LoadingResult>,
  error: Fn.T<RError, ErrorResult>,
  data: Fn.T<RData, DataResult<TData>>,
}): RLoading | RError | RData {
  switch (result.status) {
    case 'loading':
      return Fn.range(fn.loading, result);
    case 'error':
      return Fn.range(fn.error, result);
    case 'data':
      return Fn.range(fn.data, result);
  }
}

type QueryHookOptions<TVariables extends Record<string, unknown>> = Pick<
  ApolloQueryHooksOptions<never, TVariables>, (
    | 'variables'
    | 'fetchPolicy'
    | 'ssr'
    | 'displayName'
  )
>;

const DEFAULT_QUERY_OPTIONS: ApolloQueryHooksOptions = {

  /**
   * this forces to use query more strictly but makes easy to use the result in type-safety
   */
  errorPolicy: 'none',

  /**
   * recommended
   */
  partialRefetch: true,

  /**
   * `returnPartialData: true` could hurts UX unintentionally.
   */
  returnPartialData: false,
};

/**
 * This utility helps to make behavior more predictable and type-safety by restricting some options.
 *
 * This hides many options that included Apollo Client by default to avoid relying on overexposed API surface. For example `pollInterval`, if you necessary it, you should call `refetch()` in useEffect by your hand. (Seriously, instead of relying on a black-box, separate it per concern)
 *
 * Partial rendering and `errorPolicy: all` are intentionally disallowed. If you need it, use the Apollo Client as it is.
 */
export function useQuery<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TVariables> = {},
): Result<TData> {
  const useApolloQuery = React.useContext(UseApolloQueryContext);
  const { data, loading, error, refetch } = useApolloQuery(query, {
    ...options,

    // Not allows to override
    ...DEFAULT_QUERY_OPTIONS,
  });

  if (loading) {
    return { status: 'loading' };
  } else if (error) {
    return { status: 'error', error, refetch: () => void refetch() };
  } else if (data) {
    return { status: 'data', data, refetch: () => void refetch() };
  }

  throw new TypeError('The query response does not match any expected state, it seems to be a bug of the Apollo Client');
}
