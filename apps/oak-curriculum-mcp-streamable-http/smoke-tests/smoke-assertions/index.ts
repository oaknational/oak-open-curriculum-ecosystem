import {
  assertAcceptHeaderEnforcement,
  assertAuthRequired,
  assertHealthEndpoints,
} from './health.js';
import { assertInitialiseHandshake } from './initialise.js';
import { assertSuccessfulToolCall, assertToolsAndAliases } from './tools.js';
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
  } else {
    await runLocalSmokeAssertions(context);
  }
  context.logger.info('Finished smoke assertions', { mode: context.mode });
}

async function runLocalSmokeAssertions(context: SmokeContext): Promise<void> {
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);
  await assertAuthRequired(context);
  await assertInitialiseHandshake(context);
  await assertToolsAndAliases(context);
  await assertValidationFailures(context);
  await assertSuccessfulToolCall(context);
  await assertSynonymCanonicalisation(context);
}

async function runRemoteSmokeAssertions(context: SmokeContext): Promise<void> {
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);
  await assertInitialiseHandshake(context);
  await assertToolsAndAliases(context);
  await assertValidationFailures(context);
  await assertSuccessfulToolCall(context);
  await assertSynonymCanonicalisation(context);
}
