import type { Config } from '@jest/types';

import baseConfig from './jest.config.base';

const config: Config.InitialOptions = {
  ...baseConfig,
  projects: [
    '<rootDir>/packages/*/jest.config.ts',
  ],
  coveragePathIgnorePatterns: [
    'apollo-client-utils',
  ],
};

export default config;
