import {
  describe,
  test,
  expect,
  vi,
} from 'vitest';
import {
  noop,
  callable,
  required,
} from '@cometjs/core';
import * as React from 'react';
import type { ReactTestRenderer } from 'react-test-renderer';
import { create as makeRenderer, act } from 'react-test-renderer';
import { createClient } from 'urql';
import {
  Provider,
  CombinedError,
  useQuery,
} from 'urql';
import { never, makeSubject } from 'wonka';

import {
  UseQueryContext,
  useQuery4,
  mapResult4,
} from '../src';

describe('useQuery4', () => {
  type Data = {
    value: string,
  };

  type Subject = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { data: Data, operation: any }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { error: CombinedError, operation: any }
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

  const Component: React.FC = () => {
    const result = useQuery4<Data>({ query: QUERY });
    return mapResult4(result, {
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
    });
  };

  test('data or error isn\' accptted on idle state', () => {
    const mockClient = createClient({ url: 'http://localhost' });
    const executeQuery = vi.spyOn(mockClient, 'executeQuery').mockImplementation(() => never);

    let renderer: ReactTestRenderer | undefined;
    void act(() => {
      renderer = makeRenderer(
        <UseQueryContext.Provider value={useQuery}>
          <Provider value={mockClient}>
            <Component />
          </Provider>
        </UseQueryContext.Provider>,
      );
    });

    expect(executeQuery).toBeCalledTimes(0);

    required(renderer);
    renderer.root.findByType(Empty);

    void act(() => {
      required(renderer);
      renderer.update(
        <UseQueryContext.Provider
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value={(...args) => {
            void useQuery(...args);
            return [{
              data: { value: 'foo' },
              error: undefined,
              fetching: false,
              stale: false,
            }, noop];
          }}
        >
          <Provider value={mockClient}>
            <Component />
          </Provider>
        </UseQueryContext.Provider>,
      );
    });

    expect(executeQuery).toBeCalledTimes(0);

    required(renderer);
    renderer.root.findByType(Empty);

    void act(() => {
      required(renderer);
      renderer.update(
        <UseQueryContext.Provider
          value={(...args) => {
            void useQuery(...args);
            return [{
              data: undefined,
              error: new CombinedError({
                networkError: new Error('something wrong'),
              }),
              fetching: false,
              stale: false,
            }, noop];
          }}
        >
          <Provider value={mockClient}>
            <Component />
          </Provider>
        </UseQueryContext.Provider>,
      );
    });

    expect(executeQuery).toBeCalledTimes(0);

    required(renderer);
    renderer.root.findByType(Empty);
  });

  test('double-loading has no effects', () => {
    const subject = makeSubject<Subject>();
    const mockClient = createClient({ url: 'http://localhost' });
    const executeQuery = vi.spyOn(mockClient, 'executeQuery').mockImplementation(() => subject.source);

    let renderer: ReactTestRenderer | undefined;
    void act(() => {
      renderer = makeRenderer(
        <Provider value={mockClient}>
          <Component />
        </Provider>,
      );
    });

    required(renderer);
    const button = renderer.root.findByType('button');
    const load = callable(button.props.onClick);

    void act(() => {
      load();
    });

    expect(executeQuery).toBeCalledTimes(1);

    void act(() => {
      load();
    });

    expect(executeQuery).toBeCalledTimes(1);
  });

  test('refetch always executeQuery', () => {
    const subject = makeSubject<Subject>();
    const mockClient = createClient({ url: 'http://localhost' });
    const executeQuery = vi.spyOn(mockClient, 'executeQuery').mockImplementation(() => subject.source);

    let renderer: ReactTestRenderer | undefined;
    void act(() => {
      renderer = makeRenderer(
        <Provider value={mockClient}>
          <Component />
        </Provider>,
      );
    });

    required(renderer);

    let button = renderer.root.findByType('button');

    void act(() => {
      callable(button.props.onClick)();
    });

    expect(executeQuery).toBeCalledTimes(1);

    void act(() => {
      subject.next({
        operation: {},
        data: {
          value: 'foo',
        },
      });
    });

    button = renderer.root.findByType('button');
    const refetch = callable(button.props.onClick);

    void act(() => {
      refetch();
    });

    expect(executeQuery).toBeCalledTimes(2);
    renderer.root.findByType(Placeholder);

    void act(() => {
      refetch();
    });

    expect(executeQuery).toBeCalledTimes(3);
    renderer.root.findByType(Placeholder);
  });

  describe('success path', () => {
    const subject = makeSubject<Subject>();
    const mockClient = createClient({ url: 'http://localhost' });
    const executeQuery = vi.spyOn(mockClient, 'executeQuery').mockImplementation(() => subject.source);

    let renderer: ReactTestRenderer | undefined;

    test('mount', () => {
      void act(() => {
        renderer = makeRenderer(
          <Provider value={mockClient}>
            <Component />
          </Provider>,
        );
      });

      required(renderer);
      renderer.root.findByType(Empty);
    });

    test('fetch', () => {
      required(renderer);
      const button = renderer.root.findByType('button');

      void act(() => {
        callable(button.props.onClick)();
      });

      expect(executeQuery).toBeCalledTimes(1);

      required(renderer);
      renderer.root.findByType(Placeholder);
    });

    test('recieve data at first', () => {
      void act(() => {
        subject.next({
          operation: {},
          data: {
            value: 'foo',
          },
        });
      });

      expect(executeQuery).toBeCalledTimes(1);

      required(renderer);
      expect(renderer.root.findByType(DataView).children[0]).toEqual('foo');
    });

    test('recieve next data', () => {
      void act(() => {
        subject.next({
          operation: {},
          data: {
            value: 'bar',
          },
        });
      });

      expect(executeQuery).toBeCalledTimes(1);

      required(renderer);
      expect(renderer.root.findByType(DataView).children[0]).toEqual('bar');
    });

    test('recieve error', () => {
      void act(() => {
        subject.next({
          operation: {},
          error: new CombinedError({
            networkError: new Error('something wrong'),
          }),
        });
      });

      expect(executeQuery).toBeCalledTimes(1);

      required(renderer);
      expect(renderer.root.findByType(ErrorFallback).children[0]).toMatch('something wrong');
    });

    test('refetch', () => {
      required(renderer);
      const button = renderer.root.findByType('button');

      void act(() => {
        callable(button.props.onClick)();
      });

      required(renderer);
      renderer.root.findByType(Placeholder);
    });

    test('recieve data after refetching', () => {
      void act(() => {
        subject.next({
          operation: {},
          data: {
            value: 'baz',
          },
        });
      });

      expect(executeQuery).toBeCalledTimes(2);

      required(renderer);
      expect(renderer.root.findByType(DataView).children[0]).toEqual('baz');
    });
  });

  describe('failure path', () => {
    const subject = makeSubject<Subject>();
    const mockClient = createClient({ url: 'http://localhost' });
    const executeQuery = vi.spyOn(mockClient, 'executeQuery').mockImplementation(() => subject.source);

    let renderer: ReactTestRenderer | undefined;

    test('mount', () => {
      void act(() => {
        renderer = makeRenderer(
          <Provider value={mockClient}>
            <Component />
          </Provider>,
        );
      });

      required(renderer);
      renderer.root.findByType(Empty);
    });

    test('fetch', () => {
      required(renderer);
      const button = renderer.root.findByType('button');

      void act(() => {
        callable(button.props.onClick)();
      });

      expect(executeQuery).toBeCalledTimes(1);

      required(renderer);
      renderer.root.findByType(Placeholder);
    });

    test('recieve error at first', () => {
      void act(() => {
        subject.next({
          operation: {},
          error: new CombinedError({
            networkError: new Error('something wrong'),
          }),
        });
      });

      expect(executeQuery).toBeCalledTimes(1);

      required(renderer);
      expect(renderer.root.findByType(ErrorFallback).children[0]).toMatch('something wrong');
    });

    test('recieve next error', () => {
      void act(() => {
        subject.next({
          operation: {},
          error: new CombinedError({
            networkError: new Error('still failure?'),
          }),
        });
      });

      expect(executeQuery).toBeCalledTimes(1);

      required(renderer);
      expect(renderer.root.findByType(ErrorFallback).children[0]).toMatch('still failure');
    });

    test('recieve data', () => {
      void act(() => {
        subject.next({
          operation: {},
          data: {
            value: 'foo',
          },
        });
      });

      expect(executeQuery).toBeCalledTimes(1);

      required(renderer);
      expect(renderer.root.findByType(DataView).children[0]).toEqual('foo');
    });

    test('refetch', () => {
      required(renderer);
      const button = renderer.root.findByType('button');

      void act(() => {
        callable(button.props.onClick)();
      });

      required(renderer);
      renderer.root.findByType(Placeholder);
    });

    test('recieve error after refetching', () => {
      void act(() => {
        subject.next({
          operation: {},
          error: new CombinedError({
            networkError: new Error('no'),
          }),
        });
      });

      expect(executeQuery).toBeCalledTimes(2);

      required(renderer);
      expect(renderer.root.findByType(ErrorFallback).children[0]).toMatch('no');
    });
  });
});
