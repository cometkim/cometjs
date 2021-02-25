import * as React from 'react';
import type {
  ApolloError,
  DocumentNode,
  TypedDocumentNode,
  QueryHookOptions as ApolloQueryHooksOptions,
} from '@apollo/client';
import { useLazyQuery as useApolloLazyQuery } from '@apollo/client';
import { Function as Fn } from '@cometjs/core';

export const UseApolloLazyQueryContext = React.createContext(useApolloLazyQuery);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  UseApolloLazyQueryContext.displayName = 'UseApolloLazyQueryContext';
}

type IdleResult = {
  status: 'idle',
  load: () => void,
};

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
  | IdleResult
  | LoadingResult
  | ErrorResult
  | DataResult<TData>
);

export function mapLazyResult<
  TData,
  RIdle,
  RLoading,
  RError,
  RData
>(result: Result<TData>, fn: {
  idle: Fn.T<RIdle, IdleResult>,
  loading: Fn.T<RLoading, LoadingResult>,
  error: Fn.T<RError, ErrorResult>,
  data: Fn.T<RData, DataResult<TData>>,
}): RIdle | RLoading | RError | RData {
  switch (result.status) {
    case 'idle':
      return Fn.range(fn.idle, result);
    case 'loading':
      return Fn.range(fn.loading, result);
    case 'error':
      return Fn.range(fn.error, result);
    case 'data':
      return Fn.range(fn.data, result);
  }
}

type LazyQueryHookOptions<TVariables extends Record<string, unknown>> = Pick<
  ApolloQueryHooksOptions<never, TVariables>, (
    | 'variables'
    | 'fetchPolicy'
    | 'ssr'
    | 'displayName'
  )
>;

const DEFAULT_LAZY_QUERY_OPTIONS: ApolloQueryHooksOptions = {

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
 * This hides many options that included Apollo Client by default to avoid relying on over-exposed APIs. For example `pollInterval`, if you necessary it, you should call `refetch()` in useEffect by your hand. (Seriously, instead of relying on a magic-box, separate it per concern)
 *
 * Partial rendering and `errorPolicy: all` are intentionally disallowed. If you need it, use the Apollo Client as it is.
 */
export function useLazyQuery<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: LazyQueryHookOptions<TVariables> = {},
): Result<TData> {
  const useApolloLazyQuery = React.useContext(UseApolloLazyQueryContext);
  const [load, { called, loading, data, error, refetch }] = useApolloLazyQuery(query, {
    ...options,

    // Not allows to override
    ...DEFAULT_LAZY_QUERY_OPTIONS,
  });

  if (!called) {
    return { status: 'idle', load: () => load() };
  } else if (loading) {
    return { status: 'loading' };
  }

  if (typeof refetch !== 'function') {
    throw new TypeError('refetch function should be provided after fetching has been done, this seems to be a bug of the Apollo Client');
  }

  if (error) {
    return { status: 'error', error, refetch: () => void refetch() };
  } else if (data) {
    return { status: 'data', data, refetch: () => void refetch() };
  }

  throw new TypeError('The query response does not match any expected state, it seems to be a bug of the Apollo Client');
}
