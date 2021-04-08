import cloneDeepWith from 'lodash/cloneDeepWith';

export type DeeplyMocked<T> = (
  T extends ((...args: infer TArgs) => infer TReturn) ? jest.Mock<TReturn, TArgs> :
  T extends Record<string, unknown> ? { [P in keyof T]: DeeplyMocked<T[P]> } :
  T
);

function mockIfFunction(value: unknown) {
  if (typeof value === 'function') {
    return jest.fn();
  }
}

function cloneWithMock<T>(module: T): DeeplyMocked<T> {
  return cloneDeepWith(module, mockIfFunction) as DeeplyMocked<T>;
}

/**
 * Replace a module implimatations with `jest.fn`
 * Use this instead of `jest.doMock(...)`.
 *
 * @param modulePath module path to replace with mock
 *
 * @example
 * ```ts
 * beforeEach(() => {
 *  jest.resetModules();
 * });
 *
 * test('a function use file system', async () => {
 *   const fs = deepMock<typeof import('fs')>('fs');
 *   fs.readFileSync.mockImplementationOnce(path => {
 *     return `File from ${path}`;
 *   });
 *
 *   const { readContent } = await import('my-module-depends-on-fs');
 *
 *   const result = readContent('somewhere');
 *   expect(result).toEqual('File from somewhere');
 *   expect(fs.readFileSync).toBeCalledWith('somewhere');
 * });
 * ```
 */
export function deepMock<T>(modulePath: string): DeeplyMocked<T> {
  const actual = jest.requireActual<T>(modulePath);
  const mock = cloneWithMock(actual);
  jest.mock(modulePath, () => mock);
  return mock;
}
