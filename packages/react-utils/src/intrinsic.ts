import type * as React from 'react';
import type { OverrideProps } from '@cometjs/core';

/**
 * A helper type to build a component that wrap IntrinsicElements and forward its props implicitly.
 *
 * @example
 * ```tsx
 * import React from 'react';
 *
 * interface CustomInputProps {
 *   onChange?: (value: string) => void; // override the `React.ChangeEventHandler`
 * }
 *
 * const CustomInput: IntrinsicElementWrapperComponent<'input', CustomInputProps> = ({
 *   onChange,
 *   ...otherProps
 * }, forwardedRef) => {
 *   const defaultChangeHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
 *     onChange?.(e.currentTarget.value);
 *   };
 *   return (
 *     <input
 *       ref={forwardedRef}
 *       onChange={defaultChangeHandler}
 *       {...otherProps}
 *     />
 *   );
 * };
 *
 * export default React.forwardRef(CustomInput);
 * ```
 */
export type IntrinsicElementWrapperComponent<
  TElement extends keyof JSX.IntrinsicElements,
  TProps = {} // eslint-disable-line @typescript-eslint/ban-types
> = React.ForwardRefRenderFunction<
  InferIntrinsicElementFromAttributes<JSX.IntrinsicElements[TElement]>,
  OverrideProps<JSX.IntrinsicElements[TElement], TProps>
>;

type InferIntrinsicElementFromAttributes<T> = T extends React.ClassAttributes<infer TElement>
  ? TElement
  : never;
