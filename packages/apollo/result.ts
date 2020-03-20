import type { ApolloError } from '@apollo/client';
import type { Some, None } from '@cometjs/core/option';

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
  mapper: {
    data: (data: Some<TData>) => RData,
    error: (error: ApolloError) => RError,
    loading: () => RLoading,
  }
): RData | RError | RLoading {
  if (result.loading) {
    return mapper.loading();
  }

  if (result.error) {
    return mapper.error(result.error);
  }

  if (result.data) {
    return mapper.data(result.data);
  }

  throw new Error('Given object is not compatible with Apollo\'s QueryResult');
}
