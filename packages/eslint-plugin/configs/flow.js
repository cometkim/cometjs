module.exports = {
  parser: require.resolve('@babel/eslint-parser'),
  plugins: [
    '@cometjs',
    'flowtype',
  ],
  extends: [
    'plugin:@cometjs/base',
    'plugin:flowtype/recommended',
  ],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
};
