/**
 * Smoke Test: Development with Live API and Auth Enforcement
 *
 * Configuration: dev + live + auth (production-equivalent)
 * Purpose: Manual validation with REAL Clerk credentials
 *
 * ⚠️ **NOT IN AUTOMATED QUALITY GATE** ⚠️
 *
 * This smoke test requires REAL Clerk credentials that actually enforce authentication.
 * Dummy/test Clerk credentials (pk_test_*, sk_test_dummy) do NOT enforce auth - the
 * `@clerk/mcp-tools` middleware allows all requests through with test keys.
 *
 * Use this test to manually validate auth enforcement before deployment:
 * 1. Obtain real Clerk production keys from Clerk Dashboard
 * 2. Add them to .env.local (NOT .env - don't commit secrets!)
 * 3. Run: pnpm smoke:dev:live:auth
 * 4. Verify all assertions pass, especially the 401 auth check
 *
 * What this proves (with real credentials):
 * - Server starts with Clerk configuration
 * - OAuth metadata endpoints return Clerk URLs
 * - Requests without Authorization header are rejected with 401
 * - WWW-Authenticate header references real Clerk AS
 *
 * Auth enforcement in CI is validated by:
 * - E2E tests (auth-enforcement.e2e.test.ts) - use mocked Clerk behavior
 * - smoke:remote - tests real deployment with real Clerk credentials
 *
 * If you see "200 !== 401" error, you're using dummy credentials. Get real ones.
 */

import { runSmokeSuite } from './smoke-suite.js';

runSmokeSuite({ mode: 'local-live-auth' }).catch((err: unknown) => {
  console.error('Live auth smoke failed:', err);
  console.error('\n⚠️  If you see "200 !== 401", you need REAL Clerk credentials');
  console.error('Dummy Clerk test keys do not enforce authentication.');
  console.error('Get real keys from Clerk Dashboard and add to .env.local\n');
  process.exit(1);
});
