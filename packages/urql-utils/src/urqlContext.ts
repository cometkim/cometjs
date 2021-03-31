import * as React from 'react';
import { useQuery } from 'urql';

export const UseQueryContext = React.createContext(useQuery);
/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  UseQueryContext.displayName = 'UseQueryContext';
}
