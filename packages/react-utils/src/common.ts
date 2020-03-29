import type * as React from 'react';

/**
 * Infer possible prop types of `typeof MyComponent`.
 *
 * @example
 * ```tsx
 * import MyComponent from './MyComponent';
 * type MyComponentProps = PropsOf<typeof MyComponent>;
 * ```
 */
export type PropsOf<TComponent> = TComponent extends React.ComponentType<infer P> ? P : never;

/**
 * Infer a single prop type of `typeof MyComponent`.
 *
 * @example
 * ```tsx
 * import MyComponent from './MyComponent';
 * type MyComponentChangeHandler = PropOf<typeof MyComponent, 'onChange'>;
 * ```
 */
export type PropOf<TComponent, TKey extends keyof PropsOf<TComponent>> = PropsOf<TComponent>[TKey];

/**
 * Infer possible ref type of `typeof MyComponent`.
 *
 * @deprecated DefinitelyTyped now supports for this 🎉
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/43201
 *
 * @example
 * ```tsx
 * // MyComponent should be wrapped by `React.forwardRef` HoC.
 * import MyComponent from './MyComponent';
 *
 * type MyComponentRef = RefOf<typeof MyComponent>;
 * const ref = React.useRef<MyComponentRef>(null);
 *
 * <MyComponent ref={ref}/>
 * ```
 */
export type RefOf<TRefForwardingComponent> = TRefForwardingComponent extends React.ForwardRefExoticComponent<infer TProps>
  ? TProps extends { ref?: React.Ref<infer TRef> }
  ? TRef
  : never
  : never;
