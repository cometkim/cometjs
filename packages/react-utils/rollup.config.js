import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import globals from 'rollup-plugin-node-globals';

import pkg from './package.json';

const extensions = ['.ts', '.tsx'];

const config = {
  input: pkg.main,
  output: {
    name: pkg.name,
    file: pkg.publishConfig.browser,
    format: 'umd',
    sourcemap: true,
    globals: {
      react: 'React',
    },
  },
  plugins: [
    resolve({
      extensions,
    }),
    babel({
      extensions,
      babelHelpers: 'bundled',
      exclude: [
        'node_modules/**',
      ],
    }),
    globals(),
  ],
  external: [
    'react',
  ],
};

export default config;

