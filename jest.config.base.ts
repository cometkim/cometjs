import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-react',
        ['@babel/preset-env', {
          targets: {
            node: 'current',
          },
        }],
      ],
    }],
  },
  collectCoverage: true,
  testPathIgnorePatterns: [
    '.yarn',
    'node_modules',
    '__mock__',
    '\.test-d\.ts$',
  ],
  coveragePathIgnorePatterns: [
    '.yarn',
    'node_modules',
    '__mock__',
    '\.test-d\.ts$',
  ],
};

export default config;
