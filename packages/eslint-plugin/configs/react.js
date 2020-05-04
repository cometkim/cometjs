const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins: [
    '@cometjs',
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  extends: [
    'plugin:@cometjs/base',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
