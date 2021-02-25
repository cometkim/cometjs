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
  useQuery,
  mapResult,
  UseApolloQueryContext,
} from '../src/query';

t.test('query', async () => {
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
    const result = useQuery<Data>(QUERY);

    return mapResult(result, {
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

    const placeholder = renderer.root.findByType(Placeholder);
    t.ok(placeholder);

    await tick();

    const view = renderer.root.findByType(DataView);
    t.equals(view.children[0], 'foo');
  });

  t.test('failure with network error', async () => {
    const mocks: Array<MockedResponse<Data>> = [
      {
        request: {
          query: QUERY,
        },
        error: new Error('error'),
      },
    ];
    const renderer = TestRenderer.create(
      <MockedProvider mocks={mocks}>
        <Component />
      </MockedProvider>
    );

    const placeholder = renderer.root.findByType(Placeholder);
    t.ok(placeholder);

    await tick();

    const fallback = renderer.root.findByType(ErrorFallback);
    t.equals(fallback.children[0], 'NetworkError');
  });

  t.test('when graphql error', async () => {
    const mocks: Array<MockedResponse<Data>> = [
      {
        request: {
          query: QUERY,
        },
        result: {
          errors: [new GraphQLError('error')],
        },
      },
    ];
    const renderer = TestRenderer.create(
      <MockedProvider mocks={mocks}>
        <Component />
      </MockedProvider>
    );

    const placeholder = renderer.root.findByType(Placeholder);
    t.ok(placeholder);

    await tick();

    const fallback = renderer.root.findByType(ErrorFallback);
    // You might presume this should be 'ApolloError', but the ApolloError class dose not set its name :\
    t.equals(fallback.children[0], 'Error');
  });

  t.test('type error (no match)', async () => {
    const mockUseQuery: React.ContextType<typeof UseApolloQueryContext> = () => ({
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
    });

    const renderer = TestRenderer.create(
      <ErrorBoundary fallbackRender={({ error }) => <ErrorFallback error={error}/>}>
        <UseApolloQueryContext.Provider value={mockUseQuery}>
          <Component />
        </UseApolloQueryContext.Provider>
      </ErrorBoundary>
    );

    const fallback = renderer.root.findByType(ErrorFallback);
    t.equals(fallback.children[0], 'TypeError');
  });
});
