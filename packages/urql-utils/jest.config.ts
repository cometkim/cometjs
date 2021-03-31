import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
};

export default config;
