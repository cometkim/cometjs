import t from 'tap';

import { ident } from './common';
import * as Option from './option';

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

t.test('Option.isSome', async t => {
  t.assert(Option.isSome(1));
  t.assert(Option.isSome(''));
  t.assertNot(Option.isSome(null));
  t.assertNot(Option.isSome(undefined));
});

t.test('Option.isNone', async t => {
  t.assert(Option.isNone(null));
  t.assert(Option.isNone(undefined));
  t.assertNot(Option.isNone(1));
  t.assertNot(Option.isNone(''));
});

t.test('Option.toString', async t => {
  t.equals(Option.toString(1), 'Some(number)');
  t.equals(Option.toString(''), 'Some(string)');
  t.equals(Option.toString(ident), 'Some(function)');
  t.equals(Option.toString(null), 'None');
  t.equals(Option.toString(undefined), 'None');
});

t.test('Option.match', async t => {
  t.test('some', async t => {
    t.equals(Option.match(''), 'some');
    t.equals(Option.match(1), 'some');
    t.equals(Option.match({}), 'some');
    t.equals(Option.match(false), 'some');
    t.equals(Option.match(ident), 'some');
  });

  t.test('none', async t => {
    t.equals(Option.match(null), 'none');
    t.equals(Option.match(undefined), 'none');
  });
});

t.test('Option.map', async t => {
  t.test('only some', async t => {
    const v1 = 'Hey' as Option.T<string>;
    t.equals(Option.map(v1, v => v.length), 3);

    const v2 = null as Option.T<string>;
    t.equals(Option.map(v2, v => v.length), null);
  });

  t.test('patterns', async t => {
    const v1 = 'Hey' as Option.T<string>;
    t.equals(
      Option.map(v1, {
        some: v => v.length,
        none: 0,
      }),
      3,
    );
    const v2 = null as Option.T<string>;
    t.equals(
      Option.map(v2, {
        some: v => v.length,
        none: 0,
      }),
      0,
    );
  });

  t.test('partial', async t => {
    // @ts-ignore
    t.throws(() => Option.map(true, { none: true }));
    // @ts-ignore
    t.doesNotThrow(() => Option.map(true, { some: true }));
    // @ts-ignore
    t.throws(() => Option.map(null, { some: true }));
    // @ts-ignore
    t.doesNotThrow(() => Option.map(null, { none: true }));
  });

  t.test('invalid', async t => {
    // @ts-ignore
    t.throws(() => Option.map(true, 1234));
  });
});

t.test('Option.getExn', async t => {
  const v1 = Option.of(1);
  const v2 = Option.fromThrowable(() => {
    throw new Error('Hey');
  });

  t.equals(Option.getExn(v1), 1);
  t.throws(() => Option.getExn(v2));
});

t.test('Option.fromThrowable', async t => {
  const v = Option.fromThrowable(() => {
    throw new Error('Hey');
  });
  t.doesNotThrow(() => Option.map(v, ident));
  t.assert(Option.isNone(v));
});
