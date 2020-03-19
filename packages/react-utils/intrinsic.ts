import type {
  ClassAttributes,
  RefForwardingComponent,
} from 'react';

type InferIntrinsicElement<T> = T extends ClassAttributes<infer TElement> ? TElement : never;

/**
 * A type to help building a component that override intrinsic element implicitly.
 *
 * @example
 * ```tsx
 * import React from 'react';
 *
 * interface CustomInputProps {
 *   onChange?: (value: string) => void; // override the `React.ChangeEventHandler`
 * }
 *
 * const CustomInputComponent: OverrideIntrinsicComponent<'input', CustomInputProps> = ({
 *   onChange,
 *   ...otherProps
 * }, forwardedRef) => {
 *   const defaultChangeHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
 *     onChange?.(e.currentTarget.value);
 *   };
 *   return (
 *     <input
 *       ref={ref}
 *       onChange={defaultChangeHandler}
 *       {...otherProps}
 *     />
 *   );
 * };
 *
 * export default React.forwardRef(CustomInputComponent);
 * ```
 */
export type OverrideIntrinsicComponent<TTag extends keyof JSX.IntrinsicElements, TProps = {}> = RefForwardingComponent<
  InferIntrinsicElement<JSX.IntrinsicElements[TTag]>,
  Omit<JSX.IntrinsicElements[TTag], keyof TProps> & TProps
>;
