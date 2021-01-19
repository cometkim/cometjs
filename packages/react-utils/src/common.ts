import type * as React from 'react';
import type { OverrideProps } from '@cometjs/core';

/**
 * Infer possible prop types of `typeof MyComponent`.
 *
 * Has been replaced by DefinitelyTyped.
 *
 * @example
 * ```tsx
 * import MyComponent from './MyComponent';
 * type MyComponentProps = PropsOf<typeof MyComponent>; ```
 */
export type PropsOf<TComponent extends React.ComponentType> = React.ComponentProps<TComponent>;

/**
 * Infer a single prop type of `typeof MyComponent`.
 *
 * @example
 * ```tsx
 * import MyComponent from './MyComponent';
 * type MyComponentChangeHandler = PropOf<typeof MyComponent, 'onChange'>;
 * ```
 */
export type PropOf<
  TComponent extends React.ComponentType,
  TKey extends keyof PropsOf<TComponent>
> = PropsOf<TComponent>[TKey];

/**
 * Infer possible ref type of `typeof MyComponent`.
 *
 * Has been replaced by DefinitelyTyped.
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
export type RefOf<TRefForwardingComponent extends React.ElementType> = (
  React.ElementRef<TRefForwardingComponent>
);

/**
 * Safely override exist prop types
 *
 * @example
 * import BaseComponent from './BaseComponent';
 *
 * ```tsx
 * type MyComponentProps = OverrideComponentProps<typeof BaseComponent, {
 *   message: string;
 * }>;
 *
 * const MyComponent: React.FC<MyComponentProps> = ({
 *   message,
 *   ...baseProps
 * }) => {
 *   return (
 *     <BaseComponent {...baseProps}>
 *       {message}
 *     </BaseComponent>
 *   );
 * };
 * ```
 */
export type OverrideComponentProps<
  TComponent extends React.ComponentType,
  TProps
> = OverrideProps<PropsOf<TComponent>, TProps>;
