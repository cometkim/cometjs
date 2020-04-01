import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';

import pkg from './package.json';

const extensions = ['.ts', '.tsx'];

const config = {
  input: 'src/index.ts',
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
    }),
    sourcemaps(),
  ],
};

export default config;

