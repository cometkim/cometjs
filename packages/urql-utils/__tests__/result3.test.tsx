import {
  describe,
  test,
  expect,
  vi,
} from 'vitest';
import * as React from 'react';
import type { ReactTestRenderer } from 'react-test-renderer';
import { create as makeRenderer, act } from 'react-test-renderer';
import { createClient } from 'urql';
import { Provider, CombinedError } from 'urql';
import { makeSubject } from 'wonka';
import { callable, required } from '@cometjs/core';

import { useQuery3, mapResult3 } from '../src';

describe('useQuery3', () => {
  type Data = {
    value: string,
  };

  type Subject = (
    | { data: Data, operation: unknown }
    | { error: CombinedError, operation: unknown }
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

    void act(() => {
      subject.next({
        operation: {},
        data: {
          value: 'foo',
        },
      });
    });

    required(renderer);

    const button = renderer.root.findByType('button');
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
});
