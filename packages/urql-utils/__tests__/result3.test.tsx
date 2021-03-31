import * as React from 'react';
import type { ReactTestRenderer } from 'react-test-renderer';
import { create as makeRenderer, act } from 'react-test-renderer';
import { Provider, CombinedError } from 'urql';
import { makeSubject } from 'wonka';

import { useQuery3, mapResult3 } from '../src';

describe('useQuery3', () => {
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

      renderer.root.findByType(Placeholder);
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

      renderer.root.findByType(Placeholder);
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

  test('refetch always executeQuery', () => {
    const subject = makeSubject<{ data: Data }>();
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

    act(() => {
      subject.next({
        data: {
          foo: 'foo',
          bar: null,
        },
      });
    });

    const button = renderer.root.findByType('button');
    const refetch = button.props.onClick;

    act(() => {
      refetch();
    });
    expect(mockClient.executeQuery).toBeCalledTimes(2);
    renderer.root.findByType(Placeholder);

    act(() => {
      refetch();
    });
    expect(mockClient.executeQuery).toBeCalledTimes(3);
    renderer.root.findByType(Placeholder);
  });
});
