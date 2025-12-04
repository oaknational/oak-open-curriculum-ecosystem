/**
 * Vitest E2E Configuration for Oak Open Curriculum Semantic Search
 *
 * This configuration is for End-to-End tests that require real external services:
 * - Elasticsearch Serverless
 * - OpenAI API (for natural language search)
 *
 * Unlike unit/integration tests, E2E tests:
 * - Do NOT mock environment variables
 * - Do NOT use fixture data
 * - Require real credentials in .env.local
 *
 * Run with: DOTENV_CONFIG_PATH=.env.local pnpm vitest run --config vitest.e2e.config.ts
 *
 * @see tests/e2e/es-connection.e2e.test.ts
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // No setup file - we want real environment variables
    include: ['**/*.e2e.test.ts'],
    exclude: ['node_modules', '.next', 'dist'],
    // E2E tests may take longer
    testTimeout: 30000,
    // Don't run E2E tests in parallel to avoid rate limiting
    sequence: {
      concurrent: false,
    },
  },
});
