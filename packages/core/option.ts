// Type-first utilities to handle optional values

export type None = null | undefined;
export type Some<T> = Exclude<T, None>;
export type Option<T> = Some<T> | None;

export function isSome<T>(option: Option<T>): option is Some<T> {
  return option != null;
}

export function isNone<T>(option: Option<T>): option is None {
  return option == null;
}

/**
 * Populate typename of `Option<T>`
 *
 * @param option
 *
 * @return Given `Option<string>`, returns `"Some(string)"` or `"None"`
 */
export function optionToString<T>(option: Option<T>) {
  return isSome(option) ? `Some(${typeof option})` : 'None';
}

/**
 * Match the given option
 *
 * @param option
 *
 * @return `'some' | 'none'`
 */
export function matchOption<T>(option: Option<T>): 'some' | 'none' {
  return isSome(option) ? 'some' : 'none';
}

/**
 * Subtype mapper for optional value.
 *
 * @param option
 * @param mapFn A Function to map some, or an object to map both some and none.
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
export function mapOption<T, RSome, RNone = None>(
  option: Option<T>,
  mapFn: (
    | ((t: Some<T>) => RSome)
    | ({
      some: RSome | ((t: Some<T>) => RSome),
      none: RNone | (() => RNone),
    })
  )
): RSome | RNone {
  if (typeof mapFn === 'function') {
    return isSome(option) ? mapFn(option) : null as unknown as RNone;
  }
  if (typeof mapFn !== 'object') {
    throw new Error(`The second argument only allows function or object but got: ${typeof mapFn}`);
  }
  const _mapFn = mapFn[matchOption(option)];
  if (!_mapFn) {
    throw new Error(`The object doesn't have mapping to ${optionToString(option)}`);
  }
  if (typeof _mapFn === 'function') {
    return (_mapFn as (t?: Some<T>) => RSome | RNone)(option ?? undefined);
  }
  return _mapFn;
}
