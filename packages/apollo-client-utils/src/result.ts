import type { ApolloError, QueryResult } from '@apollo/client';
import type { Some } from '@cometjs/core';
import { mapToValue } from '@cometjs/core';

type LoadingResult = {
  data: undefined,
  error: undefined,
  loading: true,
};

type ErrorResult = {
  data: undefined,
  error: ApolloError,
  loading: false,
}

type DataResult<T> = {
  data: Some<T>,
  error: undefined,
  loading: false,
};

export type Result<T> = (
  | LoadingResult
  | ErrorResult
  | DataResult<T>
);

export function isLoadingResult<T>(result: Result<T>): result is LoadingResult {
  return result.loading === true;
}

export function isErrorResult<T>(result: Result<T>): result is ErrorResult {
  return Boolean(result.error);
}

export function isDataResult<T>(result: Result<T>): result is DataResult<T> {
  return Boolean(result.data);
}

export function castQueryResult<T>(result: QueryResult<T>): Result<T> {
  // Casting instead of guard because:
  // - result is Result<T> is not allowed
  // - result is Omit<QueryResult<T>,'data'|'error'|'loading'> & Result<T> would not inferred well.
  const reasons: string[] = [];
  if (!('loading' in result)) {
    reasons.push('is not compatible with LoadingResult because `loading` field is missing');
  }
  if (!('error' in result)) {
    reasons.push('is not compatible with ErrorResult because `error` field is missing');
  }
  if (!('loading' in result)) {
    reasons.push('is not compatible with DataResult<T> because `data` field is missing');
  }
  if (reasons.length) {
    throw new Error(`Given object is not compatible with Result<T> because:\n${reasons.join('\n  -')}`);
  }
  return result as Result<T>;
}

export function mapResult<
  TData,
  RData,
  RError,
  RLoading
>(
  result: QueryResult<TData>,
  map: {
    data: RData | ((data: Some<TData>) => RData),
    error: RError | ((error: ApolloError) => RError),
    loading: RLoading | (() => RLoading),
  }
): RData | RError | RLoading {
  const safeResult = castQueryResult(result);
  if (isLoadingResult(safeResult)) {
    return mapToValue(map.loading);
  } else if (isErrorResult(safeResult)) {
    return mapToValue(map.error, safeResult.error);
  } else {
    return mapToValue(map.data, safeResult.data);
  }
}
