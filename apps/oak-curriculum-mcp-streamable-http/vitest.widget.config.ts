/**
 * Vitest configuration for MCP App widget in-process tests.
 *
 * Uses jsdom environment for DOM testing. Scoped to widget/ source only —
 * server-side tests use the main vitest.config.ts with node environment.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: [
      'widget/src/**/*.unit.test.ts',
      'widget/src/**/*.unit.test.tsx',
      'widget/src/**/*.integration.test.ts',
      'widget/src/**/*.integration.test.tsx',
    ],
    exclude: ['**/*.e2e.test.ts'],
    globals: true,
  },
});
