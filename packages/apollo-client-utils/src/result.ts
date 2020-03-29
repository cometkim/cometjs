import type { ApolloError } from '@apollo/client';
import type { Some, None } from '@cometjs/core';

export type Result<TData> = (
  | {
    data: Some<TData>,
    error: None,
    loading: false,
  }
  | {
    data: None,
    error: ApolloError,
    loading: false,
  }
  | {
    data: None,
    error: None,
    loading: true,
  }
);

export function mapResult<
  TData,
  RData,
  RError,
  RLoading
>(
  result: Result<TData>,
  map: {
    data: (data: Some<TData>) => RData,
    error: (error: ApolloError) => RError,
    loading: () => RLoading,
  }
): RData | RError | RLoading {
  if (result.loading === true) {
    return map.loading();
  }

  if (result.error) {
    return map.error(result.error);
  }

  if (result.data) {
    return map.data(result.data);
  }

  throw new Error('Given object is not compatible with Apollo\'s QueryResult');
}
