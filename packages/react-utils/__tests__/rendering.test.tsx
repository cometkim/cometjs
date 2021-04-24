import * as React from 'react';
import { create as makeRenderer, act } from 'react-test-renderer';
import type { Callable } from '@cometjs/core';
import { callable } from '@cometjs/core';

import { useForceUpdate } from '../src/rendering';

describe('useForceUpdate', () => {
  const MyComponent: React.FC<{ counter: Callable }> = ({ counter }) => {
    const forceUpdate = useForceUpdate();
    React.useEffect(() => void counter());
    return <button onClick={forceUpdate}>click to force update</button>;
  };

  it('triggers component rerendering', () => {
    const counter = jest.fn();

    let renderer: ReturnType<typeof makeRenderer>;

    void act(() => {
      renderer = makeRenderer(
        <MyComponent counter={counter} />,
      );
    });

    expect(counter).toBeCalledTimes(1);

    const button = renderer.root.findByType('button');

    void act(() => {
      callable(button.props.onClick)();
    });

    expect(counter).toBeCalledTimes(2);
  });
});
