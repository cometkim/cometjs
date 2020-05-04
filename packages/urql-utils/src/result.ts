import type {
  CombinedError,
  UseQueryState,
  UseMutationState,
} from 'urql';
import type { Some } from '@cometjs/core';
import { mapToValue } from '@cometjs/core';

type FetchingResult = {
  data: undefined,
  error: undefined,
  fetching: true,
};

type ErrorResult = {
  data: undefined,
  error: CombinedError,
  fetching: false,
};

type DataResult<T> = {
  data: Some<T>,
  error: undefined,
  fetching: false,
};

export type Result<T> = (
  | FetchingResult
  | ErrorResult
  | DataResult<T>
);

export function isFetchingResult(result: Result<any>): result is FetchingResult {
  return result.fetching === true;
}

export function isErrorResult(result: Result<any>): result is ErrorResult {
  return Boolean(result.error);
}

export function isDataResult<T>(result: Result<T>): result is DataResult<T> {
  return Boolean(result.data);
}

export function castQueryResult<T>(result: UseQueryState<T> | UseMutationState<T>) {
  // Casting instead of guard because:
  // - `result is Result<T>` is not allowed
  // - `result is OverrideProps<UseQueryState<T>, Result<T>>` would not inferred well.
  const reasons: string[] = [];
  if (!('fetching' in result)) {
    reasons.push('it is not compatible with LoadingResult because `fetching` field is missing');
  }
  if (!('error' in result)) {
    reasons.push('it is not compatible with ErrorResult because `error` field is missing');
  }
  if (!('data' in result)) {
    reasons.push('it is not compatible with DataResult<T> because `data` field is missing');
  }
  if (reasons.length) {
    throw new Error(
      `Given object is not compatible with Result<T> because:\n${reasons.join('\n  -')}`,
    );
  }
  return result as Result<T>;
}

export function mapResult<
  TData,
  RData,
  RError,
  RFetching
>(
  result: UseQueryState<TData> | UseMutationState<TData>,
  map: {
    data: RData | ((data: Some<TData>) => RData),
    error: RError | ((error: CombinedError) => RError),
    fetching: RFetching | (() => RFetching),
  },
): RData | RError | RFetching {
  const safeResult = castQueryResult(result);
  if (isFetchingResult(safeResult)) {
    return mapToValue(map.fetching);
  } else if (isErrorResult(safeResult)) {
    return mapToValue(map.error, safeResult.error);
  } else {
    return mapToValue(map.data, safeResult.data);
  }
}
