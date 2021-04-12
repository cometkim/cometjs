import * as React from 'react';
import type {
  ApolloError,
  DocumentNode,
  QueryHookOptions,
  TypedDocumentNode,
} from '@apollo/client';
import { Fn } from '@cometjs/core';

import { UseQueryContext, defaultQueryOptions } from './apolloContext';

type LoadingResult = {
  _t: 'LoadingResult',
};

type DataResult<T> = {
  _t: 'DataResult',
  data: T,
  refetch: () => void,
};

type ErrorResult = {
  _t: 'ErrorResult',
  error: ApolloError,
  refetch: () => void,
};

export type Result3<T> = (
  | LoadingResult
  | DataResult<T>
  | ErrorResult
);

export function mapResult3<
  TData,
  RLoading,
  RData,
  RError,
>(result: Result3<TData>, fn: {
  loading: Fn.T<RLoading, LoadingResult>,
  data: Fn.T<RData, DataResult<TData>>,
  error: Fn.T<RError, ErrorResult>,
}): RLoading | RData | RError {
  switch (result._t) {
    case 'LoadingResult':
      return Fn.range(fn.loading, result);
    case 'DataResult':
      return Fn.range(fn.data, result);
    case 'ErrorResult':
      return Fn.range(fn.error, result);
  }
}

type UseQuery3Args<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
> = Pick<
  QueryHookOptions<TData, TVariables>,
  (
    | 'variables'
    | 'fetchPolicy'
    | 'ssr'
    | 'displayName'
  )
> & {
  query: (
    | DocumentNode
    | TypedDocumentNode<TData, TVariables>
  )
};

type State = (
  | { _t: 0 /* 'Loading' */ }
  | { _t: 1 /* 'Data' */, data: unknown }
  | { _t: 2 /* 'Error' */, error: ApolloError }
);
type Action = (
  | { _t: 0 /* 'FETCH' */ }
  | { _t: 1 /* 'RECEIVED_DATA' */, data: unknown }
  | { _t: 2 /* 'RECEIVED_ERROR' */, error: ApolloError }
);
function reducer(_state: State, action: Action): State {
  switch (action._t) {
    case 0 /* 'FETCH' */:
      return { _t: 0 /* 'Loading' */ };
    case 1 /* 'RECEIVED_DATA' */:
      return { _t: 1 /* 'Data' */, data: action.data };
    case 2 /* 'RECEIVED_ERROR' */:
      return { _t: 2 /* 'Error' */, error: action.error };
  }
}

/**
 * This utility helps to make behavior more predictable and type-safety by restricting some options and variants. (1-Query, 3-Variants)
 *
 * This hides options that included in Apollo Client by default, to avoid relying on overexposed API surface.
 *
 * For example `pollInterval`, if you necessary it, you should call `refetch()` in useEffect by your hand. (Seriously, instead of relying on a black-box, separate it per concern)
 *
 * Partial rendering and `errorPolicy: all` (which makes possible variants infinity) are intentionally disallowed. If you need it, use the Apollo Client as it is.
 */
export function useQuery3<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>({ query, ...args }: UseQuery3Args<TData, TVariables>): Result3<TData> {
  const [state, dispatch] = React.useReducer(reducer, { _t: 0 /* 'Loading' */ });

  const useQuery = React.useContext(UseQueryContext);
  const [refetchQuery, { data, error }] = useQuery(query, {
    ...args,

    // not allow to override
    ...defaultQueryOptions,
  });

  const refetch = () => {
    dispatch({ _t: 0 /* 'FETCH' */ });
    refetchQuery();
  };

  React.useEffect(refetch, []);

  React.useEffect(() => {
    if (data) {
      dispatch({ _t: 1 /* 'RECEIVED_DATA' */, data });
    }
  }, [data]);

  React.useEffect(() => {
    if (error) {
      dispatch({ _t: 2 /* 'RECEIVED_ERROR' */, error });
    }
  }, [error]);

  switch (state._t) {
    case 0 /* 'Loading' */:
      return { _t: 'LoadingResult' };
    case 1 /* 'Data' */:
      return { _t: 'DataResult', data: state.data as TData, refetch };
    case 2 /* 'Error' */:
      return { _t: 'ErrorResult', error: state.error, refetch };
  }
}
