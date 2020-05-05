import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';

import pkg from './package.json';

const extensions = ['.ts', '.tsx'];

const config = {
  input: pkg.main,
  output: {
    name: pkg.name,
    file: pkg.publishConfig.browser,
    format: 'umd',
    sourcemap: true,
  },
  external: [
    'react',
  ],
  plugins: [
    resolve({
      extensions,
    }),
    babel({
      extensions,
      exclude: [
        'node_modules/**',
      ],
    }),
    sourcemaps(),
  ],
};

export default config;

