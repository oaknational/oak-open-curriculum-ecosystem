import {
  assertAcceptHeaderEnforcement,
  assertAuthRequired,
  assertHealthEndpoints,
} from './health.js';
import { assertClerkJwksAccessible } from './clerk-jwks.js';
import { assertInitialiseHandshake } from './initialise.js';
import { assertSuccessfulToolCall, assertToolCatalogue } from './tools.js';
// import { assertAllToolsWork } from './comprehensive-tools.js'; // TODO: Fix linting and re-enable
import { assertValidationFailures } from './validation.js';
import { assertSynonymCanonicalisation } from './synonyms.js';
import { assertAuthenticatedToolCall } from './authenticated.js';
import { withEphemeralServer } from '../local-server.js';
import type { SmokeContext } from './types.js';

export { type SmokeContext } from './types.js';

export async function runSmokeAssertions(context: SmokeContext): Promise<void> {
  context.logger.info('Starting smoke assertions', {
    mode: context.mode,
    baseUrl: context.baseUrl,
    devTokenSource: context.metadata.devTokenSource,
  });
  if (context.mode === 'remote') {
    await runRemoteSmokeAssertions(context);
  } else if (context.mode === 'local-live-auth' || context.mode === 'local-stub-auth') {
    await runLocalLiveAuthSmokeAssertions(context);
  } else {
    await runLocalSmokeAssertions(context);
  }
  context.logger.info('Finished smoke assertions', { mode: context.mode });
}

/**
 * Runs a single assertion against a freshly created server instance.
 *
 * `StreamableHTTPServerTransport` in stateless mode (`sessionIdGenerator: undefined`)
 * handles exactly one MCP request per transport instance. Each MCP-level
 * assertion therefore needs its own server. Non-MCP assertions (health,
 * Accept header enforcement) share the original server because Express
 * middleware handles them before the transport is reached.
 */
async function withFreshServer(
  baseContext: SmokeContext,
  assertion: (context: SmokeContext) => Promise<void>,
): Promise<void> {
  await withEphemeralServer(async (baseUrl) => {
    await assertion({ ...baseContext, baseUrl });
  });
}

async function runLocalSmokeAssertions(context: SmokeContext): Promise<void> {
  // ── HTTP-level assertions ─────────────────────────────────────────
  // These are handled by Express middleware before the MCP transport
  // is reached, so they can share the original server instance.
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);

  // ── MCP protocol assertions ───────────────────────────────────────
  // Each assertion gets a fresh server instance because the stateless
  // transport handles exactly one MCP request per transport instance.
  // Auth bypass is enabled — skip assertAuthRequired.
  await withFreshServer(context, assertInitialiseHandshake);
  await withFreshServer(context, (ctx) => assertToolCatalogue(ctx, { expectedMinimum: 6 }));
  await withFreshServer(context, assertValidationFailures);
  await withFreshServer(context, assertSuccessfulToolCall);
  await withFreshServer(context, assertSynonymCanonicalisation);
}

async function runLocalLiveAuthSmokeAssertions(context: SmokeContext): Promise<void> {
  // For auth enforcement mode, we only test auth and discovery.
  // MCP protocol tests would fail without a real Clerk token.
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);
  await assertAuthRequired(context);
  await assertAuthenticatedToolCall(context);
  // TODO: Add OAuth discovery assertions
}

async function runRemoteSmokeAssertions(context: SmokeContext): Promise<void> {
  // Remote assertions run against a deployed server where each request
  // may hit a different Vercel function instance. Non-200 responses are
  // treated as warnings (not hard failures) because warm instances with
  // a consumed stateless transport may legitimately return 500.
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);
  await assertClerkJwksAccessible(context);
  await assertInitialiseHandshake(context);
  await assertToolCatalogue(context, { expectedMinimum: 28 });
  await assertValidationFailures(context);
  await assertSuccessfulToolCall(context);
  await assertSynonymCanonicalisation(context);
  // TODO: Re-enable comprehensive tool tests after fixing linting (file too long, complexity)
  // await assertAllToolsWork(context);
}
