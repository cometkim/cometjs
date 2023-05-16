require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: 'plugin:@cometjs/auto',
  parserOptions: {
    project: [
      'tsconfig.json',
      'packages/**/tsconfig.json',
    ],
  },
};
