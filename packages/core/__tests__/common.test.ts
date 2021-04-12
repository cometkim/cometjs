import { noop, ident } from '../src';

test('noop', () => {
  expect(typeof noop).toEqual('function');
  expect(noop).not.toThrow();
});

test('ident', () => {
  expect(ident).toBe(ident(ident));
});
