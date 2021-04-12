import type { Config } from '@jest/types';

import baseConfig from './jest.config.base';

const config: Config.InitialOptions = {
  ...baseConfig,
  projects: [
    '<rootDir>/packages/*/jest.config.ts',
  ],
};

export default config;
