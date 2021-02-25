import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import t from 'tap';
import { GraphQLError } from 'graphql';
import { gql, NetworkStatus } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { noop } from '@cometjs/core';
import { ErrorBoundary } from 'react-error-boundary';

import {
  useLazyQuery,
  mapLazyResult,
  UseApolloLazyQueryContext,
} from '../src/lazyQuery';

t.test('lazy query', async () => {
  type Data = {
    foo: string,
    bar: string | null,
  };

  const QUERY = gql`
    query Data {
      foo
      bar
    }
  `;

  class NetworkError extends Error { name = 'NetworkError' }

  const Placeholder: React.FC = () => <>loading</>;
  const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => <>{error.name}</>;
  const DataView: React.FC<{ data: Data }> = ({ data }) => <>{data.foo}</>;

  const Component: React.FC = () => {
    const result = useLazyQuery<Data>(QUERY);

    return mapLazyResult(result, {
      idle: ({ load }) => <button onClick={load}>idle</button>,
      loading: <Placeholder />,
      error: ({ error }) => (
        <ErrorFallback
          error={error.networkError
            ? new NetworkError()
            : error
          }
        />
      ),
      data: ({ data }) => <DataView data={data} />,
    });
  };

  const tick = () => new Promise(resolve => setTimeout(resolve, 0));

  t.test('success path', async () => {
    const response: MockedResponse<Data> = {
      request: {
        query: QUERY,
      },
      result: {
        data: {
          foo: 'foo',
          bar: null,
        },
      },
    };
    const renderer = TestRenderer.create(
      <MockedProvider mocks={[response]}>
        <Component />
      </MockedProvider>
    );

    const button = renderer.root.findByType('button');
    t.equals(button.children[0], 'idle');

    t.test('idle -> loading', async () => {
      button.props.onClick();
      await tick();

      const placeholder = renderer.root.findByType(Placeholder);
      t.ok(placeholder);
    });

    t.test('loaindg -> success', async () => {
      await tick();

      const view = renderer.root.findByType(DataView);
      t.equals(view.children[0], 'foo');
    });
  });

  t.test('failure with network error', async () => {
    const response: MockedResponse = {
      request: {
        query: QUERY,
      },
      error: new Error('error'),
    };
    const renderer = TestRenderer.create(
      <MockedProvider mocks={[response]}>
        <Component />
      </MockedProvider>
    );

    const button = renderer.root.findByType('button');
    t.equals(button.children[0], 'idle');

    t.test('idle -> loading', async () => {
      button.props.onClick();
      await tick();

      const placeholder = renderer.root.findByType(Placeholder);
      t.ok(placeholder);
    });

    t.test('loaindg -> error', async () => {
      await tick();

      const fallback = renderer.root.findByType(ErrorFallback);
      t.equals(fallback.children[0], 'NetworkError');
    });
  });

  t.test('failure with graphql error', async () => {
    const response: MockedResponse = {
      request: {
        query: QUERY,
      },
      result: {
        errors: [new GraphQLError('error')],
      },
    };
    const renderer = TestRenderer.create(
      <MockedProvider mocks={[response]}>
        <Component />
      </MockedProvider>
    );

    const button = renderer.root.findByType('button');
    t.equals(button.children[0], 'idle');

    t.test('idle -> loading', async () => {
      button.props.onClick();
      await tick();

      const placeholder = renderer.root.findByType(Placeholder);
      t.ok(placeholder);
    });

    t.test('loaindg -> error', async () => {
      await tick();

      const fallback = renderer.root.findByType(ErrorFallback);
      // You might presume this should be 'ApolloError', but the ApolloError class dose not set its name :\
      t.equals(fallback.children[0], 'Error');
    });
  });

  t.test('type error (refetch)', async () => {
    // @ts-ignore
    const mockUseLazyQuery: React.ContextType<typeof UseApolloLazyQueryContext> = () => [noop, {
      loading: false,
      // @ts-ignore
      data: { foo: 'bar' },
      error: undefined,
      refetch: undefined,
      called: true,
      networkStatus: NetworkStatus.ready,
      client: null as any,
      startPolling: noop,
      stopPolling: noop,
      subscribeToMore: noop,
      updateQuery: noop,
      fetchMore: noop,
      variables: undefined,
    }];

    const renderer = TestRenderer.create(
      <ErrorBoundary fallbackRender={({ error }) => <ErrorFallback error={error} />}>
        <UseApolloLazyQueryContext.Provider value={mockUseLazyQuery}>
          <Component />
        </UseApolloLazyQueryContext.Provider>
      </ErrorBoundary>
    );

    await tick();

    const fallback = renderer.root.findByType(ErrorFallback);
    t.equals(fallback.children[0], 'TypeError');
  });

  t.test('type error (no match)', async () => {
    const mockUseLazyQuery: React.ContextType<typeof UseApolloLazyQueryContext> = () => [noop, {
      loading: false,
      data: undefined,
      error: undefined,
      refetch: () => Promise.reject(),
      called: true,
      networkStatus: NetworkStatus.ready,
      client: null as any,
      startPolling: noop,
      stopPolling: noop,
      subscribeToMore: noop,
      updateQuery: noop,
      fetchMore: noop,
      variables: undefined,
    }];

    const renderer = TestRenderer.create(
      <ErrorBoundary fallbackRender={({ error }) => <ErrorFallback error={error} />}>
        <UseApolloLazyQueryContext.Provider value={mockUseLazyQuery}>
          <Component />
        </UseApolloLazyQueryContext.Provider>
      </ErrorBoundary>
    );

    const fallback = renderer.root.findByType(ErrorFallback);
    t.equals(fallback.children[0], 'TypeError');
  });
});
