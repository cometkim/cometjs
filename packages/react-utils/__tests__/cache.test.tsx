import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import { ErrorBoundary } from 'react-error-boundary';
import t from 'tap';
import { noop } from '@cometjs/core';

import { makeResourceFromPromise } from '../src';

t.test('suspense for a single promise', async () => {
  const Placeholder = () => <span>Placeholder</span>;
  const ErrorDisplay = () => <span>Error</span>;

  t.test('show placeholder if the resource is not ready yet', async () => {
    const PendingResource = makeResourceFromPromise<string>(new Promise(noop));

    const Display = () => {
      const data = PendingResource.read();
      return <span>{data}</span>;
    };

    const renderer = TestRenderer.create(
      <ErrorBoundary fallback={<ErrorDisplay />}>
        <React.Suspense fallback={<Placeholder />}>
          <Display />
        </React.Suspense>
      </ErrorBoundary>,
    );

    t.ok(renderer.root.findByType(Placeholder));
  });

  t.test('catch error from error boundary if the resource is rejected', async () => {
    const RejectedResource = makeResourceFromPromise<string>(Promise.reject(new Error('rejected')));

    const Display = () => {
      const data = RejectedResource.read();
      return <span>{data}</span>;
    };

    const render = () => (
      <ErrorBoundary fallbackRender={e => <span>{e.error.message}</span>}>
        <React.Suspense fallback={<Placeholder />}>
          <Display />
        </React.Suspense>
      </ErrorBoundary>
    );

    const renderer = TestRenderer.create(render());
    await new Promise(res => setTimeout(res, 1000));

    type R = Exclude<ReturnType<typeof renderer.toJSON>, unknown[]>;
    t.strictSame((renderer.toJSON() as R)?.children, ['rejected']);
  });

  t.test('read fulfilled value', async () => {
    const FulfilledResource = makeResourceFromPromise(Promise.resolve('test'));

    const Display = () => {
      const data = FulfilledResource.read();
      return <span>{data}</span>;
    };

    const render = () => (
      <ErrorBoundary fallback={<ErrorDisplay />}>
        <React.Suspense fallback={<Placeholder />}>
          <Display />
        </React.Suspense>
      </ErrorBoundary>
    );

    const renderer = TestRenderer.create(render());
    await new Promise(res => setTimeout(res, 1000));

    type R = Exclude<ReturnType<typeof renderer.toJSON>, unknown[]>;
    t.strictSame((renderer.toJSON() as R)?.children, ['test']);
  });
});
