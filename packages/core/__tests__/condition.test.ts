import { Condition } from '../src';

describe('Condition', () => {
  test('isTruthy', () => {
    expect(
      Condition.isTruthy(Condition.of('Hey')),
    ).toBe(true);
  });

  test('isFalsy', () => {
    expect(
      Condition.isFalsy(Condition.of('')),
    ).toBe(true);
  });

  test('map', () => {
    const a = Condition.of('Hey');
    expect(
      Condition.map(a, v => v.length),
    ).toBe(3);

    const b = Condition.of('');
    expect(
      Condition.map(b, (v: string) => v.length),
    ).toBe('');
  });
});
