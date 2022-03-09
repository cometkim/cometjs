import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: [
        'text',
        'json',
        'html',
        'lcovonly',
      ],
    },
    exclude: [
      '.pnp.*',
      '.yarn/**',
      'packages/archive/**',
    ],
  },
});
