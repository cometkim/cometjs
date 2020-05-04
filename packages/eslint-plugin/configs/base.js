module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'max-len': ['error', {
      code: 100,
      tabWidth: 2,
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    'indent': ['error', 2],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    'eol-last': ['error', 'always'],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'array-bracket-newline': ['error', 'consistent'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'array-element-newline': ['off', { multiline: true, minItems: 3 }],
    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': ['error', {
      ObjectExpression: {
        consistent: true,
      },
      ObjectPattern: {
        consistent: true,
      },
      ImportDeclaration: {
        multiline: true,
        minProperties: 3,
      },
      ExportDeclaration: {
        multiline: true,
        minProperties: 3,
      },
    }],
    'no-console': 'warn',
  },
};
