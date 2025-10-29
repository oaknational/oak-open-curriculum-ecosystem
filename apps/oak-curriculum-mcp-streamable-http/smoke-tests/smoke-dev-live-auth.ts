/**
 * Smoke Test: Development with Live API and Auth Enforcement
 *
 * Configuration: dev + live + auth (production-equivalent)
 * Purpose: Pre-deployment validation - proves production config works locally
 *
 * This is the CRITICAL smoke test that should pass before deploying to production.
 */

import { runSmokeSuite } from './smoke-suite.js';

runSmokeSuite({ mode: 'local-live-auth' }).catch((err: unknown) => {
  console.error('Live auth smoke failed:', err);
  process.exit(1);
});
