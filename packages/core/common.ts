export interface Callable {
  (...args: any[]): any;
}

export type Primitive = (
  | null
  | undefined
  | boolean
  | string
  | number
  | bigint
  | symbol
);

export type InferrableAny = Primitive | object;
