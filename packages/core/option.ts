export type None = null | undefined;
export type Some<T> = Exclude<T, None>;
export type Option<T> = Some<T> | None;

export function mapOption<T, RNone, RSome>(
  option: Option<T>,
  mapper: {
    none: () => RNone,
    some: (t: Some<T>) => RSome,
  }
): RNone | RSome {
  return option
    ? mapper.some(option)
    : mapper.none();
}
