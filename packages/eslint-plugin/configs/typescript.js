module.exports = {
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: true,
    // It is better to setup project path manually
    // project: [],
  },
  plugins: [
    '@cometjs',
    '@typescript-eslint',
  ],
  extends: [
    'plugin:@cometjs/base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'indent': 'off',
    // See https://github.com/typescript-eslint/typescript-eslint/issues/1824
    // "@typescript-eslint/indent": ["error", 2],

    // overridings
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    'quotes': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    'object-curly-spacing': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],

    // typescript-specifics
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'comma',
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
      overrides: {
        interface: {
          multiline: {
            delimiter: 'semi',
          },
        },
      },
    }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
