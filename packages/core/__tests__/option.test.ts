import {
 describe,
 test,
 expect,
} from 'vitest';

import { Option, ident } from '../src';

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

test('Option.isSome', () => {
  expect(Option.isSome(1)).toBe(true);
  expect(Option.isSome('')).toBe(true);
  expect(Option.isSome(null)).toBe(false);
  expect(Option.isSome(undefined)).toBe(false);
});

test('Option.isNone', () => {
  expect(Option.isNone(null)).toBe(true);
  expect(Option.isNone(undefined)).toBe(true);
  expect(Option.isNone(1)).toBe(false);
  expect(Option.isNone('')).toBe(false);
});

test('Option.toString', () => {
  expect(Option.toString(1)).toEqual('Some(number)');
  expect(Option.toString('')).toEqual('Some(string)');
  expect(Option.toString(ident)).toEqual('Some(function)');
  expect(Option.toString(null)).toEqual('None');
  expect(Option.toString(undefined)).toEqual('None');
});

describe('Option.match', () => {
  test('some', () => {
    expect(Option.match('')).toEqual('Some');
    expect(Option.match(1)).toEqual('Some');
    expect(Option.match({})).toEqual('Some');
    expect(Option.match(false)).toEqual('Some');
    expect(Option.match(ident)).toEqual('Some');
  });

  test('none', () => {
    expect(Option.match(null)).toEqual('None');
    expect(Option.match(undefined)).toEqual('None');
  });
});

describe('Option.map', () => {
  test('only some', () => {
    const v1 = 'Hey' as Option.T<string>;
    expect(Option.map(v1, v => v.length)).toBe(3);

    const v2 = null as Option.T<string>;
    expect(Option.map(v2, v => v.length)).toBeNull();
  });

  test('patterns', () => {
    const v1 = 'Hey' as Option.T<string>;
    expect(
      Option.map(v1, {
        Some: v => v.length,
        None: 0,
      }),
    ).toBe(3);

    const v2 = null as Option.T<string>;
    expect(
      Option.map(v2, {
        Some: v => v.length,
        None: 0,
      }),
    ).toBe(0);
  });

  test('partial', () => {
    // @ts-ignore
    expect(() => Option.map(true, { none: true })).toThrow();
    // @ts-ignore
    expect(() => Option.map(true, { some: true })).toThrow();
    // @ts-ignore
    expect(() => Option.map(null, { some: true })).toThrow();
    // @ts-ignore
    expect(() => Option.map(null, { none: true })).toThrow();
  });

  test('invalid', () => {
    // @ts-ignore
    expect(() => Option.map(true, 1234)).toThrow();
  });
});

test('Option.getExn', () => {
  const v1 = Option.of(1);
  const v2 = Option.ofUnsafe(() => {
    throw new Error('Hey');
  });

  expect(Option.getExn(v1)).toBe(1);
  expect(() => Option.getExn(v2)).toThrow();
});

test('Option.ofUnsafe', () => {
  const v = Option.ofUnsafe(() => {
    throw new Error('Hey');
  });
  expect(() => Option.map(v, ident)).not.toThrow();
  expect(Option.isNone(v)).toBe(true);
});
