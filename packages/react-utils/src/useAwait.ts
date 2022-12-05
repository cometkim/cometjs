import deepEqual from 'fast-deep-equal';

type PromiseEntry = {
  promise?: Promise<void>,
  inputs: unknown[],
  error?: unknown,
  response?: unknown,
};

const promiseCache: PromiseEntry[] = [];

export function useAwait<T, I extends unknown[] = []>(
  fn: (...inputs: I) => Promise<T>,
  inputs: I = [] as any,
  lifespan = 0,
): T {
  for (const promiseEntry of promiseCache) {
    if (deepEqual(inputs, promiseEntry.inputs)) {
      if (Object.prototype.hasOwnProperty.call(promiseEntry, 'error')) {
        throw promiseEntry.error;
      }
      if (Object.prototype.hasOwnProperty.call(promiseEntry, 'response')) {
        return promiseEntry.response as T;
      }
      throw promiseEntry.promise;
    }
  }

  const promiseEntry: PromiseEntry = {
    promise: fn(...inputs)
      .then(response => {
        promiseEntry.response = response;
      })
      .catch(e => {
        promiseEntry.error = e;
      })
      .then(() => {
        if (lifespan > 0) {
          setTimeout(() => {
            const index = promiseCache.indexOf(promiseEntry);
            if (index !== -1) {
              promiseCache.splice(index, 1);
            }
          }, lifespan);
        }
      }),
    inputs,
  };
  promiseCache.push(promiseEntry);

  throw promiseEntry.promise;
}
