import {
  describe,
  test,
  expect,
} from 'vitest';
import * as React from 'react';
import { create as makeRenderer } from 'react-test-renderer';
import { ErrorBoundary } from 'react-error-boundary';
import { noop } from '@cometjs/core';

import { makeResourceFromPromise } from '../src';

describe('suspense for a single promise', () => {
  const Placeholder = () => <span>Placeholder</span>;
  const ErrorDisplay = () => <span>Error</span>;

  const cleanup = () => new Promise<void>(res => setTimeout(res, 0));

  test('show placeholder if the resource is not ready yet', () => {
    const PendingResource = makeResourceFromPromise<string>(new Promise(noop));

    const Display = () => {
      const data = PendingResource.read();
      return <span>{data}</span>;
    };

    const renderer = makeRenderer(
      <ErrorBoundary fallback={<ErrorDisplay />}>
        <React.Suspense fallback={<Placeholder />}>
          <Display />
        </React.Suspense>
      </ErrorBoundary>,
    );

    renderer.root.findByType(Placeholder);
  });

  test('catch error from error boundary if the resource is rejected', async () => {
    const RejectedResource = makeResourceFromPromise<string>(Promise.reject(new Error('rejected')));

    const Display = () => {
      const data = RejectedResource.read();
      return <span>{data}</span>;
    };

    const renderer = makeRenderer(
      <ErrorBoundary fallbackRender={e => <span>{e.error.message}</span>}>
        <React.Suspense fallback={<Placeholder />}>
          <Display />
        </React.Suspense>
      </ErrorBoundary>,
    );

    renderer.root.findByType(Placeholder);

    await cleanup();

    expect(renderer.root.findByType('span').children[0]).toEqual('rejected');
  });

  test('read fulfilled value', async () => {
    const FulfilledResource = makeResourceFromPromise(Promise.resolve('test'));

    const Display = () => {
      const data = FulfilledResource.read();
      return <span>{data}</span>;
    };

    const renderer = makeRenderer(
      <ErrorBoundary fallback={<ErrorDisplay />}>
        <React.Suspense fallback={<Placeholder />}>
          <Display />
        </React.Suspense>
      </ErrorBoundary>,
    );

    renderer.root.findByType(Placeholder);

    await cleanup();

    expect(renderer.root.findByType('span').children[0]).toEqual('test');
  });
});
