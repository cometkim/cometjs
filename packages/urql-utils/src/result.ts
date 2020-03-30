import type { CombinedError } from 'urql';
import type { Some, None } from '@cometjs/core';

/**
 * Same with UseQueryState<T> but more ...
 */
export type Result<TData> = (
  | {
    data: Some<TData>,
    error: None,
    fetching: false,
  }
  | {
    data: None,
    error: CombinedError,
    fetching: false,
  }
  | {
    data: None,
    error: None,
    fetching: true,
  }
);

export function mapResult<
  TData,
  RData,
  RError,
  RFetching
>(
  result: Result<TData>,
  map: {
    data: (data: Some<TData>) => RData,
    error: (error: CombinedError) => RError,
    fetching: () => RFetching,
  }
): RData | RError | RFetching {
  if (result.fetching === true) {
    return map.fetching();
  }

  if (result.error) {
    return map.error(result.error);
  }

  if (result.data) {
    return map.data(result.data);
  }

  throw new Error('Given object is not compatible with urql\'s UseQueryState');
}
