import * as React from 'react';
import type { CombinedError, UseQueryArgs } from 'urql';
import { Function as Fn } from '@cometjs/core';

import { UseQueryContext } from './urqlContext';

type IdleResult = {
  _t: 'IdleResult',
  fetch: () => void,
};

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

export type Result4<T> = (
  | IdleResult
  | LoadingResult
  | DataResult<T>
  | ErrorResult
);

export function mapResult4<
  TData,
  RIdle,
  RLoading,
  RData,
  RError,
>(result: Result4<TData>, fn: {
  idle: Fn.T<RIdle, IdleResult>,
  loading: Fn.T<RLoading, LoadingResult>,
  data: Fn.T<RData, DataResult<TData>>,
  error: Fn.T<RError, ErrorResult>,
}): RIdle | RLoading | RData | RError {
  switch (result._t) {
    case 'IdleResult':
      return Fn.range(fn.idle, result);
    case 'LoadingResult':
      return Fn.range(fn.loading, result);
    case 'DataResult':
      return Fn.range(fn.data, result);
    case 'ErrorResult':
      return Fn.range(fn.error, result);
  }
}

type UseQuery4Args<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
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
  | { _t: 0 /* 'Idle' */ }
  | { _t: 1 /* 'Loading' */ }
  | { _t: 2 /* 'Data' */, data: unknown }
  | { _t: 3 /* 'Error' */, error: CombinedError }
);
type Action = (
  | { _t: 0 /* 'FETCH' */ }
  | { _t: 1 /* 'RECEIVED_DATA' */, data: unknown }
  | { _t: 2 /*'RECEIVED_ERROR' */, error: CombinedError }
);
function reducer(state: State, action: Action): State {
  switch (state._t) {
    case 0 /* 'Idle' */: {
      switch (action._t) {
        case 0 /* 'FETCH' */:
          return { _t: 1 /* 'Loading' */ };
      }
      return state;
    }
    case 1 /* 'Loading' */:
    case 2 /* 'Data' */:
    case 3 /* 'Error' */: {
      switch (action._t) {
        case 0 /* 'FETCH' */:
          return { _t: 1 /* 'Loading' */ };
        case 1 /* 'RECEIVED_DATA' */:
          return { _t: 2 /* 'Data' */, data: action.data };
        case 2 /* 'RECEIVED_ERROR' */:
          return { _t: 3 /* 'Error' */, error: action.error };
      }
    }
  }
}

export function useQuery4<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(args: UseQuery4Args<TData, TVariables>): Result4<TData> {
  const [state, dispatch] = React.useReducer(reducer, { _t: 0 /* 'Idle' */ });

  const useQuery = React.useContext(UseQueryContext);
  const [{ data, error }, refetchQuery] = useQuery({
    ...args,
    pause: state._t === 0 /* 'Idle' */,
  });

  const refetch = () => {
    dispatch({ _t: 0 /* 'FETCH' */ });
    if (state._t !== 0 /* 'Idle' */ && state._t !== 1 /* 'Loading' */) {
      refetchQuery();
    }
  };

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
    case 0 /* 'Idle' */:
      return { _t: 'IdleResult', fetch: refetch };
    case 1 /* 'Loading' */:
      return { _t: 'LoadingResult' };
    case 2 /* Data */:
      return { _t: 'DataResult', data: state.data as TData, refetch };
    case 3 /* Error */:
      return { _t: 'ErrorResult', error: state.error, refetch };
  }
}
