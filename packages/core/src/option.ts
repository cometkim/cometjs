// Type-first utilities to handle optional values (not lazy)

import * as Fn from './function';

export type None = null | undefined;
export type Some<X> = Exclude<X, None>;
export type T<X> = Some<X> | None;

export function of<X>(x: X) {
  return x as T<X>;
}

export function isSome<X>(option: T<X>): option is Some<X> {
  return option != null;
}

export function isNone<X>(option: T<X>): option is None {
  return option == null;
}

/**
 * Populate typename of `Option<T>`
 *
 * @param option
 *
 * @return Given `Option<string>`, returns `"Some(string)"` or `"None"`
 */
export function toString<X>(option: T<X>) {
  return isSome(option) ? `Some(${typeof option})` : 'None';
}

/**
 * Match the given option
 *
 * @param option
 *
 * @return `'some' | 'none'`
 */
export function match<X>(option: T<X>): 'some' | 'none' {
  return isSome(option) ? 'some' : 'none';
}

/**
 * Subtype mapper for optional value.
 *
 * @param option
 * @param map A Function to map some, or an object to map both some and none.
 *
 * @example
 * ```ts
 * let args: Option<Array<string>>;
 *
 * // Expect: Option<string>
 * const optionalArgString = mapOption(args, args => args.join(' '));
 *
 * // Expect: string
 * const argString = mapOption(args, {
 *   some: args => args.join(' '),
 *   none: '', // default value
 * });
 * ```
 */
export function map<X, RSome, RNone = None>(
  option: T<X>,
  fn: (
    | ((t: Some<X>) => RSome)
    | ({
      some: Fn.T<RSome, Some<X>>,
      none: Fn.T<RNone, void>,
    })
  ),
): RSome | RNone {
  if (typeof fn === 'function') {
    return isSome(option)
      ? fn(option)
      // Only None value can be here.
      : null as unknown as RNone;
  }

  if (typeof fn !== 'object') {
    throw new Error(
      `The second argument only allows function or object but got: ${typeof fn}`,
    );
  }

  const pattern = match(option);
  if (!(pattern in fn)) {
    throw new Error(
      `The object doesn't have bind to ${toString(option)} pattern`,
    );
  }
  return Fn.range<RSome | RNone>(fn[pattern], option);
}

export function getExn<X>(option: T<X>, errorFactory?: () => Error): Some<X> {
  return map(option, {
    some: v => v,
    none: () => {
      const error = errorFactory?.() ?? new Error(`You tried to get T of Option<T>. T is ${option}`);
      throw error;
    },
  });
}

export function fromThrowable<X>(throwable: () => T<X>): T<X> {
  try {
    return throwable();
  } catch {
    return null;
  }
}
