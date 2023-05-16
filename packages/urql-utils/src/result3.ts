import * as React from 'react';
import {
  type CombinedError,
  type UseQueryArgs,
  type AnyVariables,
} from 'urql';
import { Fn } from '@cometjs/core';

import { UseQueryContext } from './urqlContext';

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
  error: CombinedError,
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
  TVariables extends AnyVariables = AnyVariables,
> = Pick<
  UseQueryArgs<TVariables, TData>,
  (
    | 'query'
    | 'context'
    | 'variables'
    | 'requestPolicy'
  )
>;

type State = (
  | { _t: 0 /* 'Loading' */ }
  | { _t: 1 /* 'Data' */, data: unknown }
  | { _t: 2 /* 'Error' */, error: CombinedError }
);
type Action = (
  | { _t: 0 /* 'FETCH' */ }
  | { _t: 1 /* 'RECEIVED_DATA' */, data: unknown }
  | { _t: 2 /* 'RECEIVED_ERROR' */, error: CombinedError }
);
function reducer(_state: State, action: Action): State {
  switch (action._t) {
    case 0 /* 'FETCH' */:
      return { _t: 0 /* 'Loading' */ };
    case 1 /* 'RECEIVED_DATA' */:
      return { _t: 1 /* 'Data' */, data: action.data };
    case 2 /* 'RECEIVED_ERROR' */:
      return { _t: 2/* 'Error' */, error: action.error };
  }
}

export function useQuery3<
  TData = unknown,
  TVariables extends AnyVariables = AnyVariables,
>(args: UseQuery3Args<TData, TVariables>): Result3<TData> {
  const [state, dispatch] = React.useReducer(reducer, { _t: 0 /* Loading */ });

  const useQuery = React.useContext(UseQueryContext);
  const [{ data, error }, refetchQuery] = useQuery<TData>(args);

  const refetch = () => {
    dispatch({ _t: 0 /* 'FETCH' */ });
    refetchQuery();
  };

  React.useEffect(() => {
    if (data) {
      dispatch({ _t: 1 /* RECEIVED_DATA */, data });
    }
  }, [data]);

  React.useEffect(() => {
    if (error) {
      dispatch({ _t: 2/* 'RECEIVED_ERROR' */, error });
    }
  }, [error]);

  switch (state._t) {
    case 0 /* 'Loading' */:
      return { _t: 'LoadingResult' };
    case 1 /* Data */:
      return { _t: 'DataResult', data: state.data as TData, refetch };
    case 2 /* Error */:
      return { _t: 'ErrorResult', error: state.error, refetch };
  }
}
