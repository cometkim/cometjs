module.exports = {
  sourceMaps: true,

  // Additional comments can be found in source map and type definitions.
  comments: false,

  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3,
      shippedProposals: true,
    }],
  ],

  env: {
    node: {
      presets: [
        ['@babel/preset-env', {
          modules: 'commonjs',
          targets: {
            node: 10,
          },
        }],
      ],
    },

    module: {
      presets: [
        ['@babel/preset-env', {
          modules: false,
          bugfixes: true,
          targets: {
            esmodules: true,
          },
        }],
      ],
    },

    test: {
      presets: [
        ['@babel/preset-env', {
          modules: 'commonjs',
          targets: {
            node: 'current',
          },
        }],
        '@babel/preset-react',
      ],
    },
  },
};
