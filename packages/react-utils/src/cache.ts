export interface Cache<T, I = never> {
  read(input: I): T;
}

type CacheStatus = (
  | 'loading'
  | 'fullfilled'
  | 'rejected'
);

export function createCacheFromPromise<T>(promise: Promise<T>): Cache<T> {
  let status = 'loading' as CacheStatus;
  let error: unknown;
  let data: T;

  promise
    .then(fullfilled => {
      data = fullfilled;
      status = 'fullfilled';
    })
    .catch(e => {
      error = e;
      status = 'rejected';
    });

  return {
    read() {
      switch (status) {
        case 'loading': throw promise;
        case 'rejected': throw error;
        case 'fullfilled': return data;
      }
    }
  }
}
