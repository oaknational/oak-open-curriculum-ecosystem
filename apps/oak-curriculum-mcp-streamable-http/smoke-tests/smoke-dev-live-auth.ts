/**
 * Smoke Test: Development with Live API and Auth Enforcement
 *
 * Configuration: dev + live + auth (production-equivalent)
 * Purpose: Pre-deployment validation - proves production config works locally
 *
 * NOTE: This test is currently not functional because it requires REAL Clerk keys.
 * The dummy test keys used in development don't enforce authentication.
 * This test will be enabled once we have:
 * 1. A way to generate test Clerk tokens programmatically, OR
 * 2. Real Clerk credentials for testing (not recommended), OR
 * 3. Mock Clerk middleware for testing
 *
 * For now, auth enforcement is validated by:
 * - Unit tests with mock Clerk middleware
 * - E2E tests (auth-enforcement.e2e.test.ts)
 * - Manual testing with real Clerk credentials
 */

console.log('⚠️  Skipping smoke:dev:live:auth - requires real Clerk credentials');
console.log('Auth enforcement is validated via E2E tests and manual testing');
process.exit(0);

// TODO: Enable when we have a way to test with real Clerk tokens
// import { runSmokeSuite } from './smoke-suite.js';
// runSmokeSuite({ mode: 'local-live-auth' }).catch((err: unknown) => {
//   console.error('Live auth smoke failed:', err);
//   process.exit(1);
// });
