/**
 * Smoke Test: Local Stub Auth Mode
 *
 * Tests auth enforcement with stub tools enabled.
 *
 * Note: This uses real Clerk middleware for auth enforcement.
 * For fully mocked auth testing (deterministic, no external dependencies),
 * see integration tests:
 * - src/test-fixtures/mock-clerk-middleware.integration.test.ts
 * - src/clerk-auth-middleware.integration.test.ts
 *
 * Smoke tests validate end-to-end behavior of a running system.
 * Mock-based integration tests provide deterministic auth behavior validation.
 */

import { runSmokeSuite } from './smoke-suite.js';

runSmokeSuite({ mode: 'local-stub-auth' }).catch((err: unknown) => {
  console.error('Stub auth smoke failed:', err);
  process.exit(1);
});
