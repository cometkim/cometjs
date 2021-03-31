import * as React from 'react';
import type { ReactTestRenderer } from 'react-test-renderer';
import { create as makeRenderer, act } from 'react-test-renderer';
import { Provider, CombinedError, useQuery } from 'urql';
import { makeSubject } from 'wonka';

import { UseQueryContext, useQuery5, mapResult5 } from '../src';

describe('useQuery5', () => {
  type Data = {
    value: string,
  };

  type Subject = (
    | { data: Data }
    | { error: CombinedError }
  );

  const QUERY = /* GraphQL */`
    query Data {
      value
    }
  `;

  const Empty = () => <>empty</>;
  const Placeholder = () => <>loading</>;
  const DataView: React.FC<{ data: Data }> = ({ data }) => <>{data.value}</>;
  const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => <>{error.message}</>;
  const RefetchingPlaceholder = () => <>refetching</>;

  const Component: React.FC = () => {
    const result = useQuery5<Data>({ query: QUERY });
    return mapResult5(result, {
      idle: ({ fetch }) => (
        <>
          <Empty/>
          <button onClick={fetch} />
        </>
      ),
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
      refetching: (
        <RefetchingPlaceholder />
      ),
    });
  };

  test('data or error isn\' accptted on idle state', () => {
    const mockClient = {
      executeQuery: jest.fn(() => never),
    };

    let renderer: ReactTestRenderer;
    act(() => {
      renderer = makeRenderer(
        <UseQueryContext.Provider value={useQuery}>
          <Provider value={mockClient}>
            <Component />
          </Provider>
        </UseQueryContext.Provider>
      );
    });

    expect(mockClient.executeQuery).toBeCalledTimes(0);
    renderer.root.findByType(Empty);

    act(() => {
      renderer.update(
        <UseQueryContext.Provider
          value={(...args) => {
            void useQuery(...args);
            return [{
              data: {
                value: 'foo',
              },
            }]
          }}
        >
          <Provider value={mockClient}>
            <Component />
          </Provider>
        </UseQueryContext.Provider>
      );
    });

    expect(mockClient.executeQuery).toBeCalledTimes(0);
    renderer.root.findByType(Empty);

    act(() => {
      renderer.update(
        <UseQueryContext.Provider
          value={(...args) => {
            void useQuery(...args);
            return [{
              error: new CombinedError({
                networkError: new Error('something wrong'),
              }),
            }]
          }}
        >
          <Provider value={mockClient}>
            <Component />
          </Provider>
        </UseQueryContext.Provider>
      );
    });

    expect(mockClient.executeQuery).toBeCalledTimes(0);
    renderer.root.findByType(Empty);
  });

  test('double-loading has no effects', () => {
    const subject = makeSubject<Subject>();
    const mockClient = {
      executeQuery: jest.fn(() => subject.source),
    };

    let renderer: ReactTestRenderer;
    act(() => {
      renderer = makeRenderer(
        <Provider value={mockClient}>
          <Component />
        </Provider>
      );
    });

    const button = renderer.root.findByType('button');
    const load = button.props.onClick;

    act(() => {
      load();
    });

    expect(mockClient.executeQuery).toBeCalledTimes(1);

    act(() => {
      load();
    });

    expect(mockClient.executeQuery).toBeCalledTimes(1);
  });

  test('refetch always executeQuery', () => {
    const subject = makeSubject<Subject>();
    const mockClient = {
      executeQuery: jest.fn(() => subject.source),
    };

    let renderer: ReactTestRenderer;
    act(() => {
      renderer = makeRenderer(
        <Provider value={mockClient}>
          <Component />
        </Provider>
      );
    });

    let button = renderer.root.findByType('button');

    act(() => {
      button.props.onClick();
    });

    expect(mockClient.executeQuery).toBeCalledTimes(1);

    act(() => {
      subject.next({
        data: {
          foo: 'foo',
          bar: null,
        },
      });
    });

    button = renderer.root.findByType('button');
    const refetch = button.props.onClick;

    act(() => {
      refetch();
    });

    expect(mockClient.executeQuery).toBeCalledTimes(2);
    renderer.root.findByType(RefetchingPlaceholder);

    act(() => {
      refetch();
    });

    expect(mockClient.executeQuery).toBeCalledTimes(3);
    renderer.root.findByType(RefetchingPlaceholder);
  });

  describe('success path', () => {
    const subject = makeSubject<Subject>();
    const mockClient = {
      executeQuery: jest.fn(() => subject.source),
    };

    let renderer: ReactTestRenderer;

    test('mount', () => {
      act(() => {
        renderer = makeRenderer(
          <Provider value={mockClient}>
            <Component />
          </Provider>
        );
      });

      renderer.root.findByType(Empty);
    });

    test('fetch', () => {
      const button = renderer.root.findByType('button');

      act(() => {
        button.props.onClick();
      });

      expect(mockClient.executeQuery).toBeCalledTimes(1);
      renderer.root.findByType(Placeholder);
    });

    test('recieve data at first', () => {
      act(() => {
        subject.next({
          data: {
            value: 'foo',
          },
        });
      });

      expect(mockClient.executeQuery).toBeCalledTimes(1);
      expect(renderer.root.findByType(DataView).children[0]).toEqual('foo');
    });

    test('recieve next data', () => {
      act(() => {
        subject.next({
          data: {
            value: 'bar',
          },
        });
      });

      expect(mockClient.executeQuery).toBeCalledTimes(1);
      expect(renderer.root.findByType(DataView).children[0]).toEqual('bar');
    });

    test('recieve error', () => {
      act(() => {
        subject.next({
          error: new CombinedError({
            networkError: new Error('something wrong')
          }),
        });
      });

      expect(mockClient.executeQuery).toBeCalledTimes(1);
      expect(renderer.root.findByType(ErrorFallback).children[0]).toMatch('something wrong');
    });

    test('refetch', () => {
      const button = renderer.root.findByType('button');

      act(() => {
        button.props.onClick();
      });

      renderer.root.findByType(RefetchingPlaceholder);
    });

    test('recieve data after refetching', () => {
      act(() => {
        subject.next({
          data: {
            value: 'baz',
          },
        });
      });

      expect(mockClient.executeQuery).toBeCalledTimes(2);
      expect(renderer.root.findByType(DataView).children[0]).toEqual('baz');
    });
  });

  describe('failure path', () => {
    const subject = makeSubject<Subject>();
    const mockClient = {
      executeQuery: jest.fn(() => subject.source),
    };

    let renderer: ReactTestRenderer;

    test('mount', () => {
      act(() => {
        renderer = makeRenderer(
          <Provider value={mockClient}>
            <Component />
          </Provider>
        );
      });

      renderer.root.findByType(Empty);
    });

    test('fetch', () => {
      const button = renderer.root.findByType('button');

      act(() => {
        button.props.onClick();
      });

      expect(mockClient.executeQuery).toBeCalledTimes(1);
      renderer.root.findByType(Placeholder);
    });

    test('recieve error at first', () => {
      act(() => {
        subject.next({
          error: new CombinedError({
            networkError: new Error('something wrong'),
          }),
        });
      });

      expect(mockClient.executeQuery).toBeCalledTimes(1);
      expect(renderer.root.findByType(ErrorFallback).children[0]).toMatch('something wrong');
    });

    test('recieve next error', () => {
      act(() => {
        subject.next({
          error: new CombinedError({
            networkError: new Error('still failure?'),
          }),
        });
      });

      expect(mockClient.executeQuery).toBeCalledTimes(1);
      expect(renderer.root.findByType(ErrorFallback).children[0]).toMatch('still failure');
    });

    test('recieve data', () => {
      act(() => {
        subject.next({
          data: {
            value: 'foo',
          },
        });
      });

      expect(mockClient.executeQuery).toBeCalledTimes(1);
      expect(renderer.root.findByType(DataView).children[0]).toEqual('foo');
    });

    test('refetch', () => {
      const button = renderer.root.findByType('button');

      act(() => {
        button.props.onClick();
      });

      renderer.root.findByType(RefetchingPlaceholder);
    });

    test('recieve error after refetching', () => {
      act(() => {
        subject.next({
          error: new CombinedError({
            networkError: new Error('no'),
          })
        });
      });

      expect(mockClient.executeQuery).toBeCalledTimes(2);
      expect(renderer.root.findByType(ErrorFallback).children[0]).toMatch('no');
    });
  });
});
