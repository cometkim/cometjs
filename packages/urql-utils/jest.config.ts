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
};

export default config;
