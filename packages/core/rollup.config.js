import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

import pkg from './package.json';

const extensions = ['.ts'];

const config = {
  input: pkg.main,
  output: {
    name: pkg.name,
    file: pkg.publishConfig.browser,
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    resolve({
      extensions,
    }),
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
  ],
};

export default config;
