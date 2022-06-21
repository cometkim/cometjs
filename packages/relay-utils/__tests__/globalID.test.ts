import {
 describe,
 expect, 
} from 'vitest';

import { makeGlobalID, GlobalIDFormatError } from '../src';

describe('GlobalID', test => {
  const goi = makeGlobalID();

  test('toID', () => {
    const id = goi.toID({ typename: 'Post', id: '1' });
    console.log('generated id: ' + id);
    expect(id).toBeTypeOf('string');
  });

  test('fromID', () => {
    const id = goi.toID({ typename: 'Post', id: '1' });
    expect(goi.fromID(id)).toEqual({ typename: 'Post', id: '1' });
  });

  test('fromID with invalid', () => {
    // @ts-expect-error for test
    const invalid1 = goi.toID({ typename: 'Post' });
    expect(() => goi.fromID(invalid1)).toThrow(GlobalIDFormatError);

    // @ts-expect-error for test
    const invalid2 = goi.toID({ id: '1' });
    expect(() => goi.fromID(invalid2)).toThrow(GlobalIDFormatError);
  });
});
