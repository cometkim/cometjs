import { test, expect } from 'vitest';

import {
  noop,
  ident,
  callable,
  required,
} from '../src';

test('noop', () => {
  expect(typeof noop).toEqual('function');
  expect(noop).not.toThrow();
});

test('ident', () => {
  expect(ident).toBe(ident(ident));
});

test('callable', () => {
  expect(() => callable(null)).toThrow();
  expect(() => callable(noop)).not.toThrow();
});

test('required', () => {
  expect(() => required(null)).toThrow();
  expect(() => required('')).not.toThrow();
});
