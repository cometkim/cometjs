import cloneDeepWith from 'lodash-es/cloneDeepWith';

export type DeeplyMocked<T> = (
  T extends ((...args: infer TArgs) => infer TReturn) ? jest.Mock<TReturn, TArgs> :
  T extends object ? { [P in keyof T]: DeeplyMocked<T[P]> } :
  T
);

function mockIfFunction(value: unknown) {
  if (typeof value === 'function') {
    return jest.fn();
  }
}

/**
 * Deeply clone a object/function with replacing every function to `jest.fn()`
 *
 * @param module an interface
 */
export function cloneWithMock<T>(module: T) {
  return cloneDeepWith(module, mockIfFunction) as DeeplyMocked<T>;
}

/**
 * Mocking a module with deeply-mocked clone.
 * Use this instead of `jest.mock(...)`.
 *
 * @param modulePath module path to replace with mock
 *
 * @example
 * ```ts
 * const [fsMock, fs] = deeplyMocked<typeof import('fs')>('fs');
 *
 * test('a function use file system', () => {
 *   fsMock.readFileSync.mockImplementationOnce(path => {
 *     return `File from ${path}`;
 *   });
 *   const result = readContent('somewhere');
 *   expect(fsMock.readFileSync).toBeCalled();
 *   expect(result).toEqual('File from somewhere');
 * });
 * ```
 */
export function deeplyMock<T>(modulePath: string) {
  const actual = jest.requireActual(modulePath) as T;
  const mocked = cloneWithMock(actual);
  jest.mock(modulePath, () => mocked);
  return [mocked, actual] as const;
}
