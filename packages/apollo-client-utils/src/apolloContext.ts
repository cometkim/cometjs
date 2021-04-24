import * as React from 'react';
import type { QueryHookOptions } from '@apollo/client';
import { useLazyQuery } from '@apollo/client';

export const UseQueryContext = React.createContext(useLazyQuery);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  UseQueryContext.displayName = 'UseQueryContext';
}

export const defaultQueryOptions: Readonly<QueryHookOptions> = Object.freeze({

  /**
   * this forces to use query more strictly but makes easy to use the result in type-safety
   */
  errorPolicy: 'none',

  /**
   * recommended
   */
  partialRefetch: true,

  /**
   * `returnPartialData: true` could hurts UX unintentionally.
   */
  returnPartialData: false,
});
