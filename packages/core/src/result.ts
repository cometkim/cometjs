import type { Callable, Unwrap } from './common';
import * as Fn from './function';

const s_ok = Symbol('ok');
const s_err = Symbol('err');

export type Ok<T> = [typeof s_ok, T];
export type Err<T = unknown> = [typeof s_err, T];
export type T<TOk, TError = unknown> = Ok<TOk> | Err<TError>;

export function ok<TOk = void>(t: TOk | void): Ok<TOk> {
  return [s_ok, t as TOk];
}

export function err<TError = void>(t: TError | void): Err<TError> {
  return [s_err, t as TError];
}

export function ofUnsafe<TUnsafe extends Callable>(unsafe: TUnsafe): T<ReturnType<TUnsafe>> {
  try {
    return ok(unsafe());
  } catch (e) {
    return err(e);
  }
}

export async function ofPromise<
  TPromise extends Promise<unknown>,
  TOk extends Unwrap<TPromise> = Unwrap<TPromise>,
>(
  promiseFn: Fn.T<TPromise, void>,
): Promise<T<TOk>> {
  try {
    const result = (await Fn.range(promiseFn)) as TOk;
    return ok(result);
  } catch (e) {
    return err(e);
  }
}

export function match<TOk, TError>(result: T<TOk, TError>): 'Ok' | 'Err' {
  return isOk(result) ? 'Ok' : 'Err';
}

export function toString<TOk, TError>(result: T<TOk, TError>): string {
  return `${match(result)}(${typeof result})`;
}

export function isOk<TOk>(t: T<TOk, unknown>): t is Ok<TOk> {
  return t[0] === s_ok;
}

export function isErr<TError>(t: T<unknown, TError>): t is Err<TError> {
  return t[0] === s_err;
}

export function getExn<TOk>(result: T<TOk, unknown>): TOk {
  if (isOk(result)) {
    return result[1];
  }
  throw new Error(`Expected Ok<T>, but got: ${toString(result)}`);
}

export function getWithDefault<TOk>(
  result: T<TOk, unknown>,
  defaultValue: TOk,
): TOk {
  return isOk(result)
    ? result[1]
    : defaultValue;
}

export function getErrExn<TError>(result: T<unknown, TError>): TError {
  if (isErr(result)) {
    return result[1];
  }
  throw new Error(`Expected Err<T>, but got: ${toString(result)}`);
}

export function getErrWithDefault<TError>(
  result: T<unknown, TError>,
  defaultValue: TError,
): TError {
  return isErr(result)
    ? result[1]
    : defaultValue;
}

export function map<
  TOk,
  TError,
  ROk,
  RError = TError,
>(
  result: T<TOk, TError>,
  fn: (
    | ((t: TOk) => ROk)
    | ({
      Ok: Fn.T<ROk, TOk>,
      Err: Fn.T<RError, TError>,
    })
  ),
): T<ROk, RError> {
  if (typeof fn === 'function') {
    return isOk(result)
      ? ok(fn(result[1]))
      : result as unknown as Err<RError>;
  }

  if (typeof fn !== 'object') {
    throw new Error(
      `The second argument only allows function or object but got: ${typeof fn}`,
    );
  }

  const pattern = match(result);
  if (!(pattern in fn)) {
    throw new Error(
      `The object doesn't have bind to ${pattern} pattern`,
    );
  }

  return isOk(result)
    ? ok(Fn.range(fn.Ok, result[1]))
    : err(Fn.range(fn.Err, result[1]));
}
