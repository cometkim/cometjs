import { useReducer } from 'react';
import type { Callable } from '@cometjs/core';

export function useForceUpdate(): Callable {
  const [, forceUpdate] = useReducer((v: number) => v + 1, 0);
  return forceUpdate;
}
