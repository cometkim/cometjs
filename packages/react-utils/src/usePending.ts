import * as React from 'react';

type CacheEntry = {
  suspendedAt: number,
};

const cache = new WeakMap<object, CacheEntry>();

export function usePending(pending: boolean) {
  // Note this isn't working as expected since the current version of React doensn't reuse hooks due to the component suspended
  // Leave it anyway I guess this can be fixed someday in the future.
  const pendingKey = React.useRef();

  if (!pending) {
    cache.delete(pendingKey);
  }

  if (pending && !cache.has(pendingKey)) {
    cache.set(pendingKey, { suspendedAt: Date.now() });
  }

  if (pending && cache.has(pendingKey)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const entry = cache.get(pendingKey)!;
    throw new Promise(resolve => {
      setTimeout(resolve, jnd(Date.now() - entry.suspendedAt));
    });
  }
}

/**
 * @see https://en.wikipedia.org/wiki/Just-noticeable_difference
 */
function jnd(timeElapsed: number) {
  return timeElapsed < 120
    ? 120
    : timeElapsed < 480
      ? 480
      : timeElapsed < 1080
        ? 1080
        : timeElapsed < 1920
          ? 1920
          : timeElapsed < 3000
            ? 3000
            : timeElapsed < 4320
              ? 4320
              : Math.ceil(timeElapsed / 1960) * 1960;
}
