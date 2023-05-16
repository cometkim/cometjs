module.exports = {
  plugins: [
    '@cometjs',
  ],
  extends: [
    'plugin:@cometjs/base',
  ],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: ['plugin:@cometjs/typescript'],
    },
    {
      files: ['**/*.{jsx,tsx}'],
      extends: ['plugin:@cometjs/react'],
    },
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: [
        '**/*.test.{js,jsx,ts,tsx}',
        '**/__test?(s)__/**/*.{js,jsx,ts,tsx}',
        '**/__mock?(s)__/**/*.{js,jsx,ts,tsx}',
      ],
      extends: ['plugin:@cometjs/test'],
    },
    {
      files: [
        '*.{cj,ct}s?(x)',
      ],
      env: {
        node: true,
        browser: false,
      },
    },
    {
      files: [
        'gatsby-node.{js,jsx,ts,tsx}',
      ],
      env: {
        node: true,
        browser: false,
      },
    },
    {
      files: [
        'gatsby-ssr.{js,jsx,ts,tsx}',
      ],
      env: {
        'node': true,
        'browser': true,
        'shared-node-browser': true,
      },
    },
    {
      files: [
        'gatsby-browser.{js,jsx,ts,tsx}',
      ],
      env: {
        node: false,
        browser: true,
      },
    },
  ],
};
