import { test, expect } from 'vitest';

import { Result } from '../src';

test.each(
  [0, '', null, undefined],
)('Result.isOk', (v) => {
  const okValue = Result.ok(v);
  const errValue = Result.err(v);
  expect(Result.isOk(okValue)).toBe(true);
  expect(Result.isOk(errValue)).toBe(false);
});

test.each(
  [0, '', null, undefined],
)('Result.isErr', (v) => {
  const okValue = Result.ok(v);
  const errValue = Result.err(v);
  expect(Result.isErr(okValue)).toBe(false);
  expect(Result.isErr(errValue)).toBe(true);
});

test('Result.ofUnsafe', () => {
  const result1 = Result.ofUnsafe(() => new URL('http://localhost'));
  expect(Result.isOk(result1)).toBe(true);

  const result2 = Result.ofUnsafe(() => new URL('no URL'));
  expect(Result.isOk(result2)).toBe(false);
});

test('Result.ofPromise', async () => {
  const result1 = await Result.ofPromise(Promise.resolve());
  expect(Result.isOk(result1)).toBe(true);

  const result2 = await Result.ofPromise(async () => {
    return 'foo';
  });
  expect(Result.isOk(result2)).toBe(true);

  const result3 = await Result.ofPromise(Promise.reject());
  expect(Result.isErr(result3)).toBe(true);

  const result4 = await Result.ofPromise(async () => {
    throw 'foo';
  });
  expect(Result.isErr(result4)).toBe(true);
});

test('Result.match', () => {
  expect(Result.match(Result.ok())).toEqual('Ok');
  expect(Result.match(Result.err())).toEqual('Err');
});

test('Result.getExn', () => {
  const result1 = Result.ok('hi');
  expect(() => Result.getExn(result1)).not.toThrow();
  expect(Result.getExn(result1)).toEqual('hi');

  const result2 = Result.err('hi');
  expect(() => Result.getExn(result2)).toThrow();
});

test('Result.getWithDefault', () => {
  const result1 = Result.ok('hi');
  expect(Result.getWithDefault(result1, 'bye')).toEqual('hi');

  const result2 = Result.err('hi');
  expect(Result.getWithDefault(result2, 'bye')).toEqual('bye');
});

test('Result.getErrExn', () => {
  const result1 = Result.err('hi');
  expect(() => Result.getErrExn(result1)).not.toThrow();
  expect(Result.getErrExn(result1)).toEqual('hi');

  const result2 = Result.ok('hi');
  expect(() => Result.getErrExn(result2)).toThrow();
});

test('Result.getErrWithDefault', () => {
  const result1 = Result.err('hi');
  expect(Result.getErrWithDefault(result1, 'bye')).toEqual('hi');

  const result2 = Result.ok('hi');
  expect(Result.getErrWithDefault(result2, 'bye')).toEqual('bye');
});

test('Result.map', () => {
  type MyResult = Result.T<'ok', 'err'>;
  const resultOk = Result.ok('ok') as MyResult;
  const resultErr = Result.err('err') as MyResult;

  expect(Result.map(resultOk, ok => ok.length)).toEqual(Result.ok(2));
  expect(Result.map(resultErr, ok => ok.length)).toEqual(Result.err('err'));

  expect(
    Result.map(resultOk, {
      Ok: ok => ok.length,
      Err: err => err.length,
    }),
  ).toEqual(Result.ok(2));

  expect(
    Result.map(resultErr, {
      Ok: ok => ok.length,
      Err: err => err.length,
    }),
  ).toEqual(Result.err(3));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(() => Result.map(resultOk, 1)).toThrow();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(() => Result.map(resultOk, {})).toThrow();
});
