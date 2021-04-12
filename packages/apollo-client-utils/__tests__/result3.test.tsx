import * as React from 'react';
import type { ReactTestRenderer } from 'react-test-renderer';
import { create as makeRenderer, act } from 'react-test-renderer';
import { gql } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

import { useQuery3, mapResult3 } from '../src';

describe('useQuery3', () => {
  test.todo('It is not testable since apollo client\'s useLazyQuery doesn\'t observe updates of MockedProvider responses properly');

  type Data = {
    value: string,
  };

  const QUERY = gql`
    query Data {
      value
    }
  `;

  const Placeholder = () => <>loading</>;
  const DataView: React.FC<{ data: Data }> = ({ data }) => <>{data.value}</>;
  const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => <>{error.message}</>;

  const Component: React.FC = () => {
    const result = useQuery3<Data>({ query: QUERY });
    return mapResult3(result, {
      loading: (
        <Placeholder />
      ),
      data: ({ data, refetch }) => (
        <>
          <DataView data={data} />
          <button onClick={refetch} />
        </>
      ),
      error: ({ error, refetch }) => (
        <>
          <ErrorFallback error={error} />
          <button onClick={refetch} />
        </>
      ),
    });
  };

  const nextTick = () => new Promise<void>(res => setTimeout(res, 0));

  describe('success path', () => {
    let renderer: ReactTestRenderer;

    test('mount', () => {
      const mock: MockedResponse<Data> = {
        request: {
          query: QUERY,
        },
        result: {
          data: {
            value: 'foo',
          },
        },
      };

      act(() => {
        renderer = makeRenderer(
          <MockedProvider mocks={[mock]}>
            <Component />
          </MockedProvider>
        );
      });

      renderer.root.findByType(Placeholder);
    });

    test('recieve data at first', async () => {
      await act(() => {
        return nextTick();
      });

      expect(renderer.root.findByType(DataView).children[0]).toEqual('foo');
    });
  });
});
