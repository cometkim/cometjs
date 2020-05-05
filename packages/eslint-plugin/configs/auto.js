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
      files: [
        '**/*.test.{js,jsx,ts,tsx}',
        '**/__test?(s)__/**/*.{js,jsx,ts,tsx}',
        '**/__mock?(s)__/**/*.{js,jsx,ts,tsx}',
      ],
      env: {
        node: true,
        jest: true,
      },
    },
  ],
};
