import type {
  ClassAttributes,
  RefForwardingComponent,
} from 'react';

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
export type IntrinsicElementWrapperComponent<TTag extends keyof JSX.IntrinsicElements, TProps = {}> = RefForwardingComponent<
  InferIntrinsicElementFromAttributes<JSX.IntrinsicElements[TTag]>,
  Omit<JSX.IntrinsicElements[TTag], keyof TProps> & TProps
>;

type InferIntrinsicElementFromAttributes<T> = T extends ClassAttributes<infer TElement> ? TElement : never;
