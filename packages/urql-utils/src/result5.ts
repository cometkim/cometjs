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

type RefetchingResult = {
  _t: 'RefetchingResult',
};

export type Result5<T> = (
  | IdleResult
  | LoadingResult
  | DataResult<T>
  | ErrorResult
  | RefetchingResult
);

export function mapResult5<
  TData,
  RIdle,
  RLoading,
  RData,
  RError,
  RRefetching,
>(result: Result5<TData>, fn: {
  idle: Fn.T<RIdle, IdleResult>,
  loading: Fn.T<RLoading, LoadingResult>,
  data: Fn.T<RData, DataResult<TData>>,
  error: Fn.T<RError, ErrorResult>,
  refetching: Fn.T<RRefetching, RefetchingResult>,
}): RIdle | RLoading | RData | RError | RRefetching {
  switch (result._t) {
    case 'IdleResult':
      return Fn.range(fn.idle, result);
    case 'LoadingResult':
      return Fn.range(fn.loading, result);
    case 'DataResult':
      return Fn.range(fn.data, result);
    case 'ErrorResult':
      return Fn.range(fn.error, result);
    case 'RefetchingResult':
      return Fn.range(fn.refetching, result);
  }
}

type UseQuery5Args<
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
  | { _t: 4 /* 'Refetching' */ }
);
type Action = (
  | { _t: 0 /* 'FETCH' */ }
  | { _t: 1 /* 'RECEIVED_DATA' */, data: unknown }
  | { _t: 2 /* 'RECEIVED_ERROR' */, error: CombinedError }
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
    case 1 /* 'Loading ' */: {
      switch (action._t) {
        case 1 /* 'RECEIVED_DATA' */:
          return { _t: 2 /* 'Data' */, data: action.data };
        case 2 /* 'RECEIVED_ERROR' */:
          return { _t: 3 /* 'Error' */, error: action.error };
      }
      return state;
    }
    case 2 /* 'Data' */:
    case 3 /* 'Error' */:
    case 4 /* 'Refetching' */: {
      switch (action._t) {
        case 0 /* 'FETCH' */:
          return { _t: 4 /* 'Refetching' */ };
        case 1 /* 'RECEIVED_DATA' */:
          return { _t: 2 /* 'Data' */, data: action.data };
        case 2 /* 'RECEIVED_ERROR' */:
          return { _t: 3 /* 'Error' */, error: action.error };
      }
    }
  }
}

export function useQuery5<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(args: UseQuery5Args<TData, TVariables>): Result5<TData> {
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
      dispatch({ _t: 2/* 'RECEIVED_ERROR' */, error });
    }
  }, [error]);

  switch (state._t) {
    case 0 /* 'Idle' */:
      return { _t: 'IdleResult', fetch: refetch };
    case 1 /* 'Loading' */:
      return { _t: 'LoadingResult' };
    case 2 /* 'Data' */:
      return { _t: 'DataResult', data: state.data as TData, refetch };
    case 3 /* 'Error' */:
      return { _t: 'ErrorResult', error: state.error, refetch };
    case 4 /* 'Refetching' */:
      return { _t: 'RefetchingResult' };
  }
}
