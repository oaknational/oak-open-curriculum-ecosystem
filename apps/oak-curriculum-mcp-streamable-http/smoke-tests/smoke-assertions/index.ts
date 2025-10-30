import {
  assertAcceptHeaderEnforcement,
  assertAuthRequired,
  assertHealthEndpoints,
} from './health.js';
import { assertClerkJwksAccessible } from './clerk-jwks.js';
import { assertInitialiseHandshake } from './initialise.js';
import {
  assertSuccessfulToolCall,
  assertToolCatalogue,
  assertLessonToolsWork,
  assertUnitToolsWork,
} from './tools.js';
import { assertAllToolsWork } from './comprehensive-tools.js';
import { assertValidationFailures } from './validation.js';
import { assertSynonymCanonicalisation } from './synonyms.js';
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
  } else if (context.mode === 'local-live-auth') {
    await runLocalLiveAuthSmokeAssertions(context);
  } else {
    await runLocalSmokeAssertions(context);
  }
  context.logger.info('Finished smoke assertions', { mode: context.mode });
}

async function runLocalSmokeAssertions(context: SmokeContext): Promise<void> {
  // local-stub and local-live modes have auth bypass enabled
  // so we skip auth enforcement assertions
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);
  // Auth bypass enabled - skip assertAuthRequired
  await assertInitialiseHandshake(context);
  await assertToolCatalogue(context, { expectedMinimum: 6 }); // Stub mode has limited tools
  await assertValidationFailures(context);
  await assertSuccessfulToolCall(context);
  await assertSynonymCanonicalisation(context);
}

async function runLocalLiveAuthSmokeAssertions(context: SmokeContext): Promise<void> {
  // For auth enforcement mode, we only test auth and discovery
  // MCP protocol tests would fail without a real Clerk token
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);
  await assertAuthRequired(context);
  // TODO: Add OAuth discovery assertions
  // Skip MCP protocol tests - they require real Clerk token
}

async function runRemoteSmokeAssertions(context: SmokeContext): Promise<void> {
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);
  await assertClerkJwksAccessible(context); // Verify Clerk JWKS is reachable (if OAuth configured)
  await assertInitialiseHandshake(context);
  await assertToolCatalogue(context, { expectedMinimum: 28 }); // Remote has all tools
  // Comprehensive validation: ALL 28 tools with happy + unhappy paths
  await assertAllToolsWork(context);
}
