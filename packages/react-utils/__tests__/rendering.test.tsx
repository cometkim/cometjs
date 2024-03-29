import {
  describe,
  test,
  expect,
  vi,
} from 'vitest';
import * as React from 'react';
import { create as makeRenderer, act } from 'react-test-renderer';
import type { Callable } from '@cometjs/core';
import { callable, required } from '@cometjs/core';

import { useForceUpdate } from '../src/rendering';

describe('useForceUpdate', () => {
  const MyComponent: React.FC<{ counter: Callable }> = ({ counter }) => {
    const forceUpdate = useForceUpdate();
    React.useEffect(() => void counter());
    return <button onClick={forceUpdate}>click to force update</button>;
  };

  test('it triggers component rerendering', () => {
    const counter = vi.fn();

    let renderer: ReturnType<typeof makeRenderer> | undefined;

    void act(() => {
      renderer = makeRenderer(
        <MyComponent counter={counter} />,
      );
    });
    required(renderer);

    expect(counter).toBeCalledTimes(1);

    const button = renderer.root.findByType('button');

    void act(() => {
      callable(button.props.onClick)();
    });

    expect(counter).toBeCalledTimes(2);
  });
});
