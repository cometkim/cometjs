export interface Resource<T, I = void> {
  read(input: I): T;
}

type ResourceStatus = (
  | 'pending'
  | 'fulfilled'
  | 'rejected'
);

export function makeResourceFromPromise<T>(promise: Promise<T>): Resource<T> {
  let status = 'pending' as ResourceStatus;
  let error: unknown;
  let data: T;

  promise
    .then(fullfilled => {
      data = fullfilled;
      status = 'fulfilled';
    })
    .catch(e => {
      error = e;
      status = 'rejected';
    });

  return {
    read() {
      switch (status) {
        case 'pending': throw promise;
        case 'rejected': throw error;
        case 'fulfilled': return data;
      }
    },
  };
}
